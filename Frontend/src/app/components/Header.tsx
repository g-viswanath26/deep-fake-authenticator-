import { Shield, Sparkles, Video } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                <Shield className="size-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                DeepGuard AI
              </h1>
              <p className="text-xs text-gray-500">Advanced Video Deepfake Detection</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 rounded-full border border-gray-600">
              <Video className="size-4 text-cyan-400" />
              <span className="text-sm font-medium text-gray-300">Analysis Engine</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2 rounded-full border border-cyan-500/30">
              <Sparkles className="size-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">v2.5.1</span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
