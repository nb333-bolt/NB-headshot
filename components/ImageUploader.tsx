
import React, { useRef } from 'react';
import { Icons } from '../constants.tsx';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  preview: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, preview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-indigo-100 aspect-square max-w-sm mx-auto shadow-inner">
          <img 
            src={preview} 
            alt="Original Preview" 
            className="w-full h-full object-cover" 
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            <span className="text-white font-medium flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <Icons.Upload /> Replace Photo
            </span>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group aspect-square max-w-sm mx-auto flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icons.Camera />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">Upload your casual photo</p>
            <p className="text-sm text-slate-500 mt-1">Portrait orientation works best</p>
          </div>
          <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP</p>
        </div>
      )}
    </div>
  );
};
