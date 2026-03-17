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
  min: number;
  max: number;
  n: number;
}

function sturgesRule(n: number): number {
  // Regra de Sturges: k = 1 + 3.322 * log10(n)
  // Define o número ótimo de classes para dividir os dados
  return Math.ceil(1 + 3.322 * Math.log10(n));
}

export function calculateFrequencyDistribution(data: number[]): FrequencyDistribution {
  // Ordena os dados para encontrar limites
  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  
  // Amplitude Total (AT) = Valor máximo - Valor mínimo
  const totalAmplitude = max - min;

  // Calcula número de classes (k) usando regra de Sturges
  // Limita entre 6 e 10 classes para melhor visualização
  const k = Math.min(Math.max(sturgesRule(data.length), 6), 10);
  
  // Amplitude de classe (h) = AT / k
  const classWidth = Math.ceil(totalAmplitude / k);

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

export function calculateStatistics(data: number[]): Statistics {
  const n = data.length;
  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];

  // Média Aritmética (x̄) = Σ(xi) / n
  const mean = data.reduce((a, b) => a + b, 0) / n;

  // Mediana: valor central que divide os dados em 50/50
  // Para n par: média entre o (n/2)º e (n/2 + 1)º termos do rol ordenado
  // Para n ímpar: é o valor do meio
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

  // Moda: valor(es) que mais se repete(m) no conjunto
  // Pode ser amodal (nenhum valor se repete),
  // unimodal (um valor é moda) ou multimodal (vários valores com mesma frequência)
  const freqMap: Record<string, number> = {};
  for (const v of data) {
    const key = String(v);
    freqMap[key] = (freqMap[key] ?? 0) + 1;
  }
  const maxFreq = Math.max(...Object.values(freqMap));
  const modeValues = Object.entries(freqMap)
    .filter(([, f]) => f === maxFreq)
    .map(([v]) => Number(v))
    .sort((a, b) => a - b);

  let mode: number | number[] | null;
  let modeType: Statistics['modeType'];

  if (maxFreq === 1) {
    mode = null;
    modeType = 'amodal';
  } else if (modeValues.length === 1) {
    mode = modeValues[0];
    modeType = 'unimodal';
  } else {
    mode = modeValues;
    modeType = 'multimodal';
  }

  // Variância amostral (s²) = Σ(xi - x̄)² / (n - 1)
  // Usa n-1 (Bessel's correction) para amostras
  // Indica quanto os dados variam em relação à média
  const variance = data.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (n - 1);
  
  // Desvio Padrão (s) = √(s²)
  // Raiz quadrada da variância, na mesma unidade dos dados
  const stdDev = Math.sqrt(variance);
  
  // Coeficiente de Variação (CV) = (s / x̄) * 100
  // Mede a variabilidade relativa em percentual
  // Útil para comparar variabilidade de variáveis com diferentes unidades/escalas
  const cv = (stdDev / mean) * 100;

  return { mean, median, mode, modeType, variance, stdDev, cv, min, max, n };
}
