import { useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const MAX_IMAGES = 6;

export default function ImageUploader({ images = [], onChange }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const processFiles = useCallback(
    (files) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const newImages = [];
      for (const file of files) {
        if (newImages.length >= remaining) break;
        if (!file.type.startsWith('image/')) continue;
        newImages.push({
          id: uuidv4(),
          file,
          url: URL.createObjectURL(file),
        });
      }
      if (newImages.length > 0) onChange([...images, ...newImages]);
    },
    [images, onChange]
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

  const handlePaste = useCallback(
    (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageFiles = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length > 0) {
        e.preventDefault();
        processFiles(imageFiles);
      }
    },
    [processFiles]
  );

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e) => {
    processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const removeImage = (id) => {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.url);
    onChange(images.filter((i) => i.id !== id));
  };

  const slots = [];
  for (let i = 0; i < MAX_IMAGES; i++) {
    if (i < images.length) {
      slots.push(
        <div key={images[i].id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
          <img src={images[i].url} alt="Hotel" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => removeImage(images[i].id)}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          >
            ✕
          </button>
        </div>
      );
    } else {
      slots.push(
        <button
          type="button"
          key={`empty-${i}`}
          onClick={handleClick}
          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50 transition-all flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[10px] leading-tight text-center px-0.5">
            Pega imagen<br />o haz clic
          </span>
        </button>
      );
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Imágenes del Hotel
        <span className="text-gray-400 font-normal ml-1">
          (máx. {MAX_IMAGES})
        </span>
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onPaste={handlePaste}
        className={`rounded-xl p-3 transition-all duration-200 ${
          dragOver ? 'ring-2 ring-violet-400 bg-violet-50' : ''
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="grid grid-cols-3 gap-2">
          {slots}
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center">
          Arrastra imágenes, pega con Ctrl+V o haz clic en un slot vacío
        </p>
      </div>
    </div>
  );
}
