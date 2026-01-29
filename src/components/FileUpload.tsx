import { useCallback } from 'react';

interface FileUploadProps {
  onFileLoad: (content: string) => void;
}

export function FileUpload({ onFileLoad }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onFileLoad(content);
        };
        reader.readAsText(file);
      }
    },
    [onFileLoad]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onFileLoad(content);
        };
        reader.readAsText(file);
      }
    },
    [onFileLoad]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-soft-black-lighter rounded-xl p-12 text-center hover:border-brand-400 transition-colors cursor-pointer bg-soft-black-light/50"
    >
      <div className="space-y-4">
        <div className="text-6xl">📄</div>
        <div className="text-xl font-semibold text-gray-200">
          Drop your Claude Code session log here
        </div>
        <div className="text-gray-400">or</div>
        <label className="inline-block px-6 py-3 bg-brand-400 hover:bg-brand-500 text-white rounded-lg cursor-pointer transition-colors">
          Browse Files
          <input
            type="file"
            accept=".json,.jsonl"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
        <div className="text-sm text-gray-500">
          Supports .json and .jsonl files
        </div>
      </div>
    </div>
  );
}
