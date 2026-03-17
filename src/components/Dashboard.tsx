import { useMemo, useState } from 'react';
import type { SensorRow, NumericFieldKey } from '../utils/csvParser';
import { NUMERIC_FIELDS, extractField } from '../utils/csvParser';
import { calculateFrequencyDistribution, calculateStatistics } from '../utils/statistics';
import { FrequencyTable } from './FrequencyTable';
import { Charts } from './Charts';

interface DashboardProps {
  data: SensorRow[];
  filename: string;
  onReset: () => void;
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-xl border px-4 py-4 flex flex-col gap-1',
        accent ? 'border-blue-200 bg-blue-50' : 'border-zinc-200 bg-white',
      ].join(' ')}
    >
      <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">{label}</span>
      <span className={`text-xl font-semibold tracking-tight ${accent ? 'text-blue-700' : 'text-zinc-800'}`}>
        {value}
      </span>
      {sub && <span className="text-xs text-zinc-400">{sub}</span>}
    </div>
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className="font-mono font-medium text-zinc-700">{value}</span>
    </div>
  );
}

function formatMode(
  mode: number | number[] | null,
  modeType: 'amodal' | 'unimodal' | 'multimodal',
  unit: string
): string {
  if (modeType === 'amodal') return 'Amodal';
  if (typeof mode === 'number') return `${fmt(mode)} ${unit}`;
  if (Array.isArray(mode)) return mode.map((m) => `${fmt(m)} ${unit}`).join(', ');
  return 'N/A';
}

export function Dashboard({ data, filename, onReset }: DashboardProps) {
  const [selectedField, setSelectedField] = useState<NumericFieldKey>('payload.eco2');

  const currentField = NUMERIC_FIELDS.find((f) => f.key === selectedField)!;

  const values = useMemo(() => extractField(data, selectedField), [data, selectedField]);
  const stats = useMemo(() => calculateStatistics(values), [values]);
  const distribution = useMemo(() => calculateFrequencyDistribution(values), [values]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-base font-semibold text-zinc-900">Analise Estatistica</h1>
              <p className="text-xs text-zinc-400 truncate max-w-[220px] sm:max-w-xs">{filename}</p>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 text-xs bg-zinc-100 text-zinc-500 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {stats.n} amostras
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
            <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl min-w-max">
              {NUMERIC_FIELDS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSelectedField(f.key)}
                  className={[
                    'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                    selectedField === f.key
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700',
                  ].join(' ')}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={onReset}
              className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors px-2 py-1.5 whitespace-nowrap"
            >
              Trocar arquivo
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8 w-full">
        <div className="bg-white border border-zinc-200 rounded-xl px-4 sm:px-5 py-4 flex flex-wrap items-center gap-3 sm:gap-6">
          <div>
            <p className="text-xs text-zinc-400 mb-0.5">Variavel analisada</p>
            <p className="font-semibold text-zinc-800">
              {currentField.label}{' '}
              <span className="text-zinc-400 font-normal">({currentField.unit})</span>
            </p>
          </div>
          <div className="w-px h-8 bg-zinc-100 hidden sm:block" />
          <InfoBadge label="Amplitude Total (AT)" value={fmt(distribution.totalAmplitude)} />
          <InfoBadge label="No de classes (k)" value={String(distribution.numClasses)} />
          <InfoBadge
            label="Amplitude de classe (h)"
            value={`${fmt(distribution.classWidth)} ${currentField.unit}`}
          />
          <InfoBadge label="n" value={String(stats.n)} />
        </div>

        <div>
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            Medidas Descritivas
          </h2>
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-9 gap-3">
            <StatCard label="Minimo" value={fmt(stats.min)} sub={currentField.unit} />
            <StatCard label="Maximo" value={fmt(stats.max)} sub={currentField.unit} />
            <StatCard label="Media (x)" value={fmt(stats.mean)} sub={currentField.unit} accent />
            <StatCard label="Mediana" value={fmt(stats.median)} sub={currentField.unit} accent />
            <StatCard
              label="Moda"
              value={
                stats.modeType === 'amodal'
                  ? 'Amodal'
                  : Array.isArray(stats.mode)
                  ? `${stats.mode.length} valores`
                  : `${fmt(stats.mode as number)}`
              }
              sub={
                stats.modeType === 'amodal'
                  ? 'conjunto amodal'
                  : stats.modeType === 'multimodal'
                  ? formatMode(stats.mode, stats.modeType, currentField.unit)
                  : currentField.unit
              }
              accent
            />
            <StatCard label="Variancia (s2)" value={fmt(stats.variance)} sub={`${currentField.unit}2`} />
            <StatCard label="Desvio Padrao (s)" value={fmt(stats.stdDev)} sub={currentField.unit} />
            <StatCard label="CV (%)" value={`${fmt(stats.cv)}%`} sub="coef. de variacao" />
            <StatCard label="n" value={String(stats.n)} sub="amostras" />
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            Graficos
          </h2>
          <Charts classes={distribution.classes} unit={currentField.unit} n={stats.n} />
        </div>

        <div>
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            Tabela de Distribuicao de Frequencias
          </h2>
          <FrequencyTable classes={distribution.classes} n={stats.n} />
        </div>

        <div className="text-center pb-8">
          <p className="text-xs text-zinc-400">
            Variancia amostral (n-1) - Regra de Sturges para numero de classes -
            Mediana calculada sobre o Rol de dados
          </p>
        </div>
      </main>

      <footer className="bg-white border-t border-zinc-200 px-4 sm:px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-zinc-500">
            Desenvolvido por <span className="font-semibold text-zinc-700">Giordano Bruno Biasi Berwig</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
