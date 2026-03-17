import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Area,
  AreaChart,
} from 'recharts';
import type { ClassInterval } from '../utils/statistics';

interface ChartsProps {
  classes: ClassInterval[];
  unit: string;
  n: number;
}

const AXIS_STYLE = { fontSize: 11, fill: '#71717a' };
const GRID_STROKE = '#f4f4f5';

function HistogramTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ClassInterval }[];
}) {
  if (!active || !payload?.length) return null;
  const cls = payload[0].payload;
  return (
    <div className="bg-white border border-zinc-200 rounded-lg px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-zinc-700">{cls.label}</p>
      <p className="text-zinc-500 mt-0.5">
        fi = <span className="font-medium text-zinc-800">{cls.fi}</span>
      </p>
      <p className="text-zinc-500">
        {cls.frel.toFixed(2)}% das amostras
      </p>
    </div>
  );
}

function OgiveTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ClassInterval }[];
}) {
  if (!active || !payload?.length) return null;
  const cls = payload[0].payload;
  return (
    <div className="bg-white border border-zinc-200 rounded-lg px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-zinc-700">{cls.label}</p>
      <p className="text-zinc-500 mt-0.5">
        Fi = <span className="font-medium text-zinc-800">{cls.Fi}</span>
      </p>
      <p className="text-zinc-500">
        {cls.frelAcum.toFixed(2)}% acumulado
      </p>
    </div>
  );
}

export function Charts({ classes, unit, n }: ChartsProps) {
  const shortLabel = classes.map((c) => ({
    ...c,
    shortLabel: c.lowerBound.toFixed(0),
  }));
  const chartHeight = 220;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6">
        <div className="mb-5">
          <h3 className="font-semibold text-zinc-800">Histograma</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Frequência absoluta por classe de intervalo
          </p>
        </div>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={shortLabel} barCategoryGap="4%">
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="shortLabel"
              tick={AXIS_STYLE}
              label={{
                value: unit,
                position: 'insideBottomRight',
                offset: -4,
                fontSize: 11,
                fill: '#a1a1aa',
              }}
            />
            <YAxis tick={AXIS_STYLE} allowDecimals={false} />
            <Tooltip content={<HistogramTooltip />} cursor={{ fill: '#f4f4f5' }} />
            <Bar dataKey="fi" fill="#3b82f6" radius={[4, 4, 0, 0]} name="fi" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6">
        <div className="mb-5">
          <h3 className="font-semibold text-zinc-800">Ogiva (Polígono de Frequências Acumuladas)</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Frequência acumulada por limite superior da classe
          </p>
        </div>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={shortLabel}>
            <defs>
              <linearGradient id="ogiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="shortLabel"
              tick={AXIS_STYLE}
              label={{
                value: unit,
                position: 'insideBottomRight',
                offset: -4,
                fontSize: 11,
                fill: '#a1a1aa',
              }}
            />
            <YAxis tick={AXIS_STYLE} domain={[0, n]} allowDecimals={false} />
            <Tooltip content={<OgiveTooltip />} />
            <Area
              type="monotone"
              dataKey="Fi"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#ogiveGradient)"
              dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#1d4ed8' }}
              name="Fi"
            />
            <ReferenceDot
              x={classes[Math.floor(classes.length / 2)]?.lowerBound.toFixed(0)}
              y={Math.round(n / 2)}
              r={4}
              fill="#f59e0b"
              stroke="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
