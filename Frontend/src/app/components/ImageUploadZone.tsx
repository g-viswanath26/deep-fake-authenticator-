import { Upload, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";

interface ImageUploadZoneProps {
  onImageSelect: (file: File) => void;
  isDragging: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

export function ImageUploadZone({
  onImageSelect,
  isDragging,
  onDragEnter,
  onDragLeave,
}: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDragLeave();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragging
          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105"
          : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
      }`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full inline-block mb-4">
          {isDragging ? (
            <ImageIcon className="size-8 text-white" />
          ) : (
            <Upload className="size-8 text-white" />
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isDragging ? "Drop your image here" : "Upload Image for Analysis"}
      </h3>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold text-blue-600">Click to browse</span> or drag and drop
      </p>
      <p className="text-sm text-gray-500">
        Supports PNG, JPG, JPEG, WebP • Max 10MB
      </p>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Secure • Encrypted • Private</span>
        </div>
      </div>
    </div>
  );
}
