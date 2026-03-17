import { useCallback, useState } from 'react';
import { UploadCloud } from './icons/UploadCloud';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  error?: string;
}

export function FileUpload({ onFileSelect, error }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Análise Estatística
          </h1>
          <p className="mt-2 text-zinc-500 text-sm px-2 sm:px-0">
            Faça upload do arquivo CSV para iniciar a análise de distribuição de frequências
          </p>
        </div>

        <label
          htmlFor="csv-upload"
          className={[
            'relative flex flex-col items-center justify-center gap-4',
            'border-2 border-dashed rounded-2xl p-8 sm:p-14 cursor-pointer transition-all duration-200',
            dragging
              ? 'border-blue-500 bg-blue-50 scale-[1.01]'
              : 'border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50',
          ].join(' ')}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <div
            className={[
              'w-14 h-14 rounded-full flex items-center justify-center transition-colors',
              dragging ? 'bg-blue-100' : 'bg-zinc-100',
            ].join(' ')}
          >
            <UploadCloud
              className={`w-7 h-7 ${dragging ? 'text-blue-500' : 'text-zinc-400'}`}
            />
          </div>

          <div className="text-center">
            <p className="text-zinc-700 font-medium">
              Arraste o arquivo aqui{' '}
              <span className="text-blue-600 hover:underline">ou clique para selecionar</span>
            </p>
            <p className="text-xs text-zinc-400 mt-1">Apenas arquivos .CSV</p>
          </div>

          <input
            id="csv-upload"
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={onInputChange}
          />
        </label>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {['Temperatura', 'Umidade', 'Ruído', 'eCO₂', 'TVOC'].map((v) => (
            <span
              key={v}
              className="text-xs text-zinc-500 bg-zinc-100 rounded-full px-3 py-1"
            >
              {v}
            </span>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center border-t border-zinc-200 pt-6">
          <p className="text-xs text-zinc-400">
            Desenvolvido por <span className="font-semibold text-zinc-600">Giordano Bruno Biasi Berwig</span>
          </p>
        </div>
      </div>
    </div>
  );
}
