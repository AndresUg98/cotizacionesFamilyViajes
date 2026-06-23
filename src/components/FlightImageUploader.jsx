import { useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function FlightImageUploader({ image, onChange }) {
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return;
      const oldUrl = image?.url;
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      onChange({ id: uuidv4(), file, url: URL.createObjectURL(file) });
    },
    [image, onChange]
  );

  const processFiles = useCallback(
    (files) => {
      if (files.length > 0) handleFile(files[0]);
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      processFiles(Array.from(e.dataTransfer.files));
    },
    [processFiles]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e) => {
    processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handlePaste = useCallback(
    (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    },
    [handleFile]
  );

  const handleRemove = () => {
    if (image?.url) URL.revokeObjectURL(image.url);
    onChange(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Imagen del Vuelo
      </label>

      {!image && (
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onPaste={handlePaste}
          onClick={handleClick}
          tabIndex={0}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 outline-none ${
            dragOver
              ? 'border-cyan-400 bg-cyan-50'
              : 'border-gray-300 bg-gray-50 hover:border-cyan-400 hover:bg-cyan-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <svg
            className={`mx-auto h-10 w-10 mb-2 transition-colors ${
              dragOver ? 'text-cyan-400' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-cyan-500">
              Haz clic para subir
            </span>{' '}
            o arrastra una imagen
          </p>
          <p className="text-xs text-gray-400 mt-1">
            También puedes pegar desde el portapapeles con{' '}
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[11px] font-mono">
              Ctrl+V
            </kbd>
          </p>
        </div>
      )}

      {image && (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={image.url}
            alt="Vuelo"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-500 transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
            Imagen del Vuelo
          </div>
        </div>
      )}
    </div>
  );
}
