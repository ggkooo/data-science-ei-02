import Papa from 'papaparse';

export type SensorRow = {
  'payload.temperature': number;
  'payload.humidity': number;
  'payload.noise': number;
  'payload.eco2': number;
  'payload.tvoc': number;
  'payload.timestamp': string;
  'payload.sector': string;
  'payload.device': string;
};

export const NUMERIC_FIELDS = [
  { key: 'payload.temperature' as const, label: 'Temperatura', unit: '°C' },
  { key: 'payload.humidity' as const, label: 'Umidade', unit: '%' },
  { key: 'payload.noise' as const, label: 'Ruído', unit: 'dB' },
  { key: 'payload.eco2' as const, label: 'eCO₂', unit: 'ppm' },
  { key: 'payload.tvoc' as const, label: 'TVOC', unit: 'ppb' },
] as const;

export type NumericFieldKey = (typeof NUMERIC_FIELDS)[number]['key'];

export function parseCSV(file: File): Promise<SensorRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: SensorRow[] = results.data
          .map((row) => ({
            'payload.temperature': Number(row['payload.temperature']),
            'payload.humidity': Number(row['payload.humidity']),
            'payload.noise': Number(row['payload.noise']),
            'payload.eco2': Number(row['payload.eco2']),
            'payload.tvoc': Number(row['payload.tvoc']),
            'payload.timestamp': row['payload.timestamp'] ?? '',
            'payload.sector': row['payload.sector'] ?? '',
            'payload.device': row['payload.device'] ?? '',
          }))
          .filter((row) =>
            NUMERIC_FIELDS.every((f) => !isNaN(row[f.key]))
          );
        resolve(rows);
      },
      error: (err) => reject(err),
    });
  });
}

export function extractField(data: SensorRow[], field: NumericFieldKey): number[] {
  return data.map((row) => row[field]);
}
