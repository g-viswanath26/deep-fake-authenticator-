import { AlertTriangle, CheckCircle, Shield, Activity, Brain, Cpu } from "lucide-react";
import { Progress } from "./ui/progress";
import { motion } from "motion/react";

interface AnalysisResultProps {
  fakePercentage: number;
  realPercentage: number;
  confidence: number;
  detectionDetails: {
    label: string;
    value: string;
    status: "detected" | "not-detected";
  }[];
}

export function AnalysisResult({
  fakePercentage,
  realPercentage,
  confidence,
  detectionDetails,
}: AnalysisResultProps) {
  const isFake = fakePercentage > 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Verdict Card */}
      <div className="relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            isFake
              ? "from-red-500/10 via-orange-500/10 to-red-500/10"
              : "from-green-500/10 via-emerald-500/10 to-green-500/10"
          }`}
        ></div>
        <div className="relative rounded-2xl p-8 border-2 border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`${
                  isFake ? "bg-red-100" : "bg-green-100"
                } p-3 rounded-xl`}
              >
                {isFake ? (
                  <AlertTriangle className="size-8 text-red-600" />
                ) : (
                  <CheckCircle className="size-8 text-green-600" />
                )}
              </motion.div>
              <div>
                <h3
                  className={`text-2xl font-bold mb-1 ${
                    isFake ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {isFake ? "Deepfake Detected" : "Authentic Image"}
                </h3>
                <p className="text-sm text-gray-600">
                  Neural network analysis completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium mb-1">Confidence</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                    className="text-gray-200"
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
                  <span className="text-3xl font-bold text-red-600">
                    {fakePercentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700">Fake Probability</p>
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
                    className="text-gray-200"
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
                  <span className="text-3xl font-bold text-green-600">
                    {realPercentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700">Authenticity</p>
            </motion.div>
          </div>

          {/* AI Model Info */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <Brain className="size-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Neural Network Model</p>
              <p className="text-xs text-gray-600">DeepDetect v2.5.1 • Trained on 45M samples</p>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="size-5 text-purple-600" />
          <h4 className="font-semibold text-gray-800">Deep Analysis Markers</h4>
        </div>
        <div className="space-y-3">
          {detectionDetails.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="group relative"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      detail.status === "detected"
                        ? "bg-red-500 shadow-lg shadow-red-500/50"
                        : "bg-green-500 shadow-lg shadow-green-500/50"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {detail.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      detail.status === "detected"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {detail.value}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Additional Info */}
      <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <Shield className="size-5 text-amber-600" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Processing Time:</span> 2.3s • <span className="font-semibold">Layers Analyzed:</span> 127
        </p>
      </div>
    </motion.div>
  );
}
