import type { ClassInterval } from '../utils/statistics';

interface FrequencyTableProps {
  classes: ClassInterval[];
  n: number;
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function FrequencyTable({ classes, n }: FrequencyTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th className="px-4 py-3 font-semibold text-zinc-700 whitespace-nowrap">Classe</th>
            <th className="px-4 py-3 font-semibold text-zinc-700 text-center whitespace-nowrap">
              Ponto Médio (x<sub>i</sub>)
            </th>
            <th className="px-4 py-3 font-semibold text-zinc-700 text-center whitespace-nowrap">
              Freq. Absoluta (f<sub>i</sub>)
            </th>
            <th className="px-4 py-3 font-semibold text-zinc-700 text-center whitespace-nowrap">
              Freq. Acumulada (F<sub>i</sub>)
            </th>
            <th className="px-4 py-3 font-semibold text-zinc-700 text-center whitespace-nowrap">
              Freq. Relativa (%)
            </th>
            <th className="px-4 py-3 font-semibold text-zinc-700 text-center whitespace-nowrap">
              Fr. Rel. Acum. (%)
            </th>
            <th className="px-4 py-3 font-semibold text-zinc-700 text-center whitespace-nowrap w-36">
              Distribuição
            </th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls, i) => (
            <tr
              key={cls.label}
              className={[
                'border-b border-zinc-100 transition-colors',
                i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/60',
                'hover:bg-blue-50/40',
              ].join(' ')}
            >
              <td className="px-4 py-3 font-mono text-zinc-700 text-xs whitespace-nowrap">
                {cls.label}
              </td>
              <td className="px-4 py-3 text-center text-zinc-600 font-mono text-xs">
                {fmt(cls.midpoint)}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                  {cls.fi}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-zinc-600">{cls.Fi}</td>
              <td className="px-4 py-3 text-center text-zinc-600">{fmt(cls.frel)}%</td>
              <td className="px-4 py-3 text-center text-zinc-600">{fmt(cls.frelAcum)}%</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(cls.fi / n) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400 w-8 text-right">
                    {fmt(cls.frel, 1)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-zinc-50 border-t-2 border-zinc-200">
            <td className="px-4 py-3 font-semibold text-zinc-700">Total</td>
            <td className="px-4 py-3" />
            <td className="px-4 py-3 text-center font-semibold text-zinc-700">{n}</td>
            <td className="px-4 py-3 text-center font-semibold text-zinc-700">{n}</td>
            <td className="px-4 py-3 text-center font-semibold text-zinc-700">100,00%</td>
            <td className="px-4 py-3 text-center font-semibold text-zinc-700">100,00%</td>
            <td className="px-4 py-3" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
