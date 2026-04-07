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
  const sumXiFi = classes.reduce((acc, cls) => acc + cls.midpoint * cls.fi, 0);
  const sumFiXi2 = classes.reduce((acc, cls) => acc + cls.fi * cls.midpoint ** 2, 0);

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
              x<sub>i</sub>f<sub>i</sub>
            </th>
            <th className="px-4 py-3 font-semibold text-zinc-700 text-center whitespace-nowrap">
              f<sub>i</sub>x<sub>i</sub><sup>2</sup>
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
              <td className="px-4 py-3 text-center text-zinc-600 font-mono text-xs">
                {fmt(cls.midpoint * cls.fi)}
              </td>
              <td className="px-4 py-3 text-center text-zinc-600 font-mono text-xs">
                {fmt(cls.fi * cls.midpoint ** 2)}
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
            <td className="px-4 py-3 text-center font-semibold text-zinc-700">{fmt(sumXiFi)}</td>
            <td className="px-4 py-3 text-center font-semibold text-zinc-700">{fmt(sumFiXi2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
