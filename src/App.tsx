import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import type { SensorRow } from './utils/csvParser';
import { parseCSV } from './utils/csvParser';

function App() {
  const [data, setData] = useState<SensorRow[] | null>(null);
  const [filename, setFilename] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleFile = async (file: File) => {
    setError(undefined);
    try {
      const rows = await parseCSV(file);
      if (rows.length === 0) {
        setError('O arquivo não contém dados válidos ou as colunas esperadas estão ausentes.');
        return;
      }
      setFilename(file.name);
      setData(rows);
    } catch {
      setError('Erro ao processar o arquivo. Verifique se é um CSV válido.');
    }
  };

  const handleReset = () => {
    setData(null);
    setFilename('');
    setError(undefined);
  };

  if (data) {
    return <Dashboard data={data} filename={filename} onReset={handleReset} />;
  }

  return <FileUpload onFileSelect={handleFile} error={error} />;
}

export default App;
