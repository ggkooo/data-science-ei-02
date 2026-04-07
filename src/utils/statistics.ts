export interface ClassInterval {
  label: string;
  lowerBound: number;
  upperBound: number;
  midpoint: number;
  fi: number;       // frequência absoluta
  Fi: number;       // frequência acumulada
  frel: number;     // frequência relativa (%)
  frelAcum: number; // frequência relativa acumulada (%)
}

export interface FrequencyDistribution {
  classes: ClassInterval[];
  totalAmplitude: number;
  classWidth: number;
  numClasses: number;
}

export interface Statistics {
  mean: number;
  median: number;
  mode: number | number[] | null;
  modeType: 'amodal' | 'unimodal' | 'multimodal';
  variance: number;
  stdDev: number;
  cv: number;
  sumFiXi: number;
  sumFiXi2: number;
  min: number;
  max: number;
  n: number;
}

export function calculateFrequencyDistribution(data: number[]): FrequencyDistribution {
  if (data.length === 0) {
    return { classes: [], totalAmplitude: 0, classWidth: 0, numClasses: 0 };
  }

  // Ordena os dados para encontrar limites
  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  
  // Amplitude Total (AT) = Valor máximo - Valor mínimo
  const totalAmplitude = max - min;

  // Método da disciplina: h = AT / sqrt(n), arredondado para inteiro
  const classWidth = Math.max(Math.round(totalAmplitude / Math.sqrt(data.length)), 1);
  const k = Math.max(Math.ceil(totalAmplitude / classWidth), 1);

  let cumFreq = 0;
  let cumRelFreq = 0;
  const classes: ClassInterval[] = [];

  for (let i = 0; i < k; i++) {
    const lowerBound = min + i * classWidth;
    const upperBound = lowerBound + classWidth;
    const isLast = i === k - 1;

    const count = data.filter((v) => {
      if (isLast) return v >= lowerBound && v <= max;
      return v >= lowerBound && v < upperBound;
    }).length;

    cumFreq += count;
    const relFreq = (count / data.length) * 100;
    cumRelFreq += relFreq;

    classes.push({
      label: `${lowerBound.toFixed(2)} ⊢ ${upperBound.toFixed(2)}`,
      lowerBound,
      upperBound,
      midpoint: (lowerBound + upperBound) / 2,
      fi: count,
      Fi: cumFreq,
      frel: relFreq,
      frelAcum: cumRelFreq,
    });
  }

  return { classes, totalAmplitude, classWidth, numClasses: k };
}

export function calculateStatistics(
  data: number[],
  distribution?: FrequencyDistribution
): Statistics {
  const n = data.length;
  if (n === 0) {
    return {
      mean: 0,
      median: 0,
      mode: null,
      modeType: 'amodal',
      variance: 0,
      stdDev: 0,
      cv: 0,
      sumFiXi: 0,
      sumFiXi2: 0,
      min: 0,
      max: 0,
      n: 0,
    };
  }

  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];

  const freqDistribution = distribution ?? calculateFrequencyDistribution(data);
  const classes = freqDistribution.classes;
  const h = freqDistribution.classWidth;

  // Média para dados agrupados: x̄ = Σ(fi * xi) / n
  const sumFiXi = classes.reduce((acc, cls) => acc + cls.fi * cls.midpoint, 0);
  const sumFiXi2 = classes.reduce((acc, cls) => acc + cls.fi * cls.midpoint ** 2, 0);
  const mean = sumFiXi / n;

  // Mediana para dados agrupados: Md = Li + [((n/2) - Fant) / fi] * h
  const half = n / 2;
  const medianClassIndex = classes.findIndex((cls) => cls.Fi >= half);
  const medianIdx = medianClassIndex === -1 ? classes.length - 1 : medianClassIndex;
  const medianClass = classes[medianIdx];
  const cumulativeBeforeMedian = medianIdx > 0 ? classes[medianIdx - 1].Fi : 0;
  const median =
    medianClass && medianClass.fi > 0
      ? medianClass.lowerBound + ((half - cumulativeBeforeMedian) / medianClass.fi) * h
      : mean;

  // Moda para dados agrupados: Mo = Li + [d1 / (d1 + d2)] * h
  const maxFreq = Math.max(...classes.map((cls) => cls.fi));
  const modalClassIndexes = classes
    .map((cls, idx) => ({ fi: cls.fi, idx }))
    .filter((item) => item.fi === maxFreq)
    .map((item) => item.idx);

  let mode: number | number[] | null = null;
  let modeType: Statistics['modeType'] = 'amodal';

  if (maxFreq > 0 && modalClassIndexes.length < classes.length) {
    const modalValues = modalClassIndexes.map((idx) => {
      const current = classes[idx];
      const prevFi = idx > 0 ? classes[idx - 1].fi : 0;
      const nextFi = idx < classes.length - 1 ? classes[idx + 1].fi : 0;
      const d1 = current.fi - prevFi;
      const d2 = current.fi - nextFi;
      const denominator = d1 + d2;

      if (denominator <= 0) {
        return current.midpoint;
      }

      return current.lowerBound + (d1 / denominator) * h;
    });

    if (modalValues.length === 1) {
      mode = modalValues[0];
      modeType = 'unimodal';
    } else {
      mode = modalValues.sort((a, b) => a - b);
      modeType = 'multimodal';
    }
  }

  // Variância populacional para dados agrupados: σ² = Σ(fi * (xi - x̄)²) / n
  const variance = Math.max(sumFiXi2 / n - mean ** 2, 0);

  // Desvio padrão populacional: σ = √σ²
  const stdDev = Math.sqrt(variance);

  // Coeficiente de variação: CV = (σ / x̄) * 100
  const cv = mean === 0 ? 0 : (stdDev / mean) * 100;

  return { mean, median, mode, modeType, variance, stdDev, cv, sumFiXi, sumFiXi2, min, max, n };
}
