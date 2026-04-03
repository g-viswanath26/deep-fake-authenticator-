import { Upload, Video as VideoIcon } from "lucide-react";
import { useRef } from "react";

interface VideoUploadZoneProps {
  onVideoSelect: (file: File) => void;
  isDragging: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

export function VideoUploadZone({
  onVideoSelect,
  isDragging,
  onDragEnter,
  onDragLeave,
}: VideoUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDragLeave();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      onVideoSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoSelect(file);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragging
          ? "border-cyan-500 bg-cyan-500/10 scale-105"
          : "border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/50"
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
        accept="video/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-full inline-block mb-4">
          {isDragging ? (
            <VideoIcon className="size-8 text-white" />
          ) : (
            <Upload className="size-8 text-white" />
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        {isDragging ? "Drop your video here" : "Upload Video for Analysis"}
      </h3>
      <p className="text-gray-400 mb-1">
        <span className="font-semibold text-cyan-400">Click to browse</span> or drag and drop
      </p>
      <p className="text-sm text-gray-500">
        Supports MP4, AVI, MOV, WebM • Max 100MB
      </p>
      
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Secure • Encrypted • Frame-by-Frame Analysis</span>
        </div>
      </div>
    </div>
  );
}
