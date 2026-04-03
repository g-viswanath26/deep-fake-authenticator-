import { AlertTriangle, CheckCircle, Shield, Activity, Cpu, Eye } from "lucide-react";
import { motion } from "motion/react";

interface VideoAnalysisResultProps {
  result: string;
  score: number;
  heatmapUrl: string | null;
  framesAnalyzed?: number;
  facesDetected?: number;
}

export function VideoAnalysisResult({
  result,
  score,
  heatmapUrl,
  framesAnalyzed = 0,
  facesDetected = 0,
}: VideoAnalysisResultProps) {
  const isFake = score > 0.5;
  const fakePercentage = Math.round(score * 100);
  const realPercentage = 100 - fakePercentage;
  
  // Calculate confidence based on how far the score is from the 0.5 threshold
  const confidence = Math.round(Math.abs(score - 0.5) * 200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Verdict Card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            isFake
              ? "from-red-500/10 via-orange-500/10 to-red-500/10"
              : "from-green-500/10 via-emerald-500/10 to-green-500/10"
          }`}
        ></div>
        <div className="relative p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`${
                  isFake ? "bg-red-500/20 border-red-500" : "bg-green-500/20 border-green-500"
                } p-3 rounded-xl border-2`}
              >
                {isFake ? (
                  <AlertTriangle className="size-8 text-red-400" />
                ) : (
                  <CheckCircle className="size-8 text-green-400" />
                )}
              </motion.div>
              <div>
                <h3
                  className={`text-2xl font-bold mb-1 ${
                    isFake ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {result}
                </h3>
                <p className="text-sm text-gray-400">
                  Frame-by-frame neural analysis completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium mb-1">Confidence</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {confidence}%
              </p>
            </div>
          </div>

          {/* Large Percentage Display */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="relative mb-3">
                <svg className="transform -rotate-90 w-32 h-32 mx-auto">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 56 * (1 - fakePercentage / 100)
                    }`}
                    className="text-red-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-red-400">
                    {fakePercentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-300">Deepfake Score</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="relative mb-3">
                <svg className="transform -rotate-90 w-32 h-32 mx-auto">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 56 * (1 - realPercentage / 100)
                    }`}
                    className="text-green-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-green-400">
                    {realPercentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-300">Authenticity</p>
            </motion.div>
          </div>

          {/* Processing Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Activity className="size-5 text-cyan-400" />
                <div>
                  <p className="text-xs text-gray-400">Frames Analyzed</p>
                  <p className="text-lg font-bold text-white">{framesAnalyzed}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Eye className="size-5 text-purple-400" />
                <div>
                  <p className="text-xs text-gray-400">Faces Detected</p>
                  <p className="text-lg font-bold text-white">{facesDetected}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Visualization */}
      {heatmapUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="size-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Neural Activation Heatmap</h4>
          </div>
          <div className="relative rounded-xl overflow-hidden border-2 border-gray-700 min-h-[200px] flex items-center justify-center bg-gray-900">
            <img
              src={heatmapUrl}
              alt="Detection Heatmap"
              className="w-full h-auto object-cover"
              onError={(e) => {
                // Fallback for mock backend
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.classList.add('bg-gradient-to-r', 'from-blue-900', 'to-purple-900');
                const span = document.createElement('span');
                span.className = 'text-cyan-400 font-medium absolute';
                span.innerText = 'Mock Heatmap Data';
                e.currentTarget.parentElement!.appendChild(span);
              }}
            />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-600">
              <p className="text-xs text-cyan-400 font-medium">AI Attention Map</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            Red areas indicate regions flagged by the neural network as potentially manipulated
          </p>
        </motion.div>
      )}

      {/* Technical Details */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="size-5 text-blue-400" />
          <h4 className="font-semibold text-white">Analysis Details</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Model Architecture</p>
            <p className="text-sm font-medium text-white">CNN + Face Detection</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Processing Time</p>
            <p className="text-sm font-medium text-white">~{(framesAnalyzed * 0.15).toFixed(1)}s</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Detection Method</p>
            <p className="text-sm font-medium text-white">Frame Extraction</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Preprocessing</p>
            <p className="text-sm font-medium text-white">Face Alignment</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
