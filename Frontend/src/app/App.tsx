import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { StatsBar } from "./components/StatsBar";
import { VideoUploadZone } from "./components/VideoUploadZone";
import { VideoAnalysisResult } from "./components/VideoAnalysisResult";
import { TechnologyStack } from "./components/TechnologyStack";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Loader2, RotateCcw, Sparkles, Video, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";

interface AnalysisData {
  result: string;
  score: number;
  heatmapUrl: string | null;
  framesAnalyzed: number;
  facesDetected: number;
}

function MainDetector() {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = window.location.origin;

  const handleVideoSelect = (file: File) => {
    setSelectedVideo(file);
    setAnalysisResult(null);
    setProgress(0);
    setError(null);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const analyzeVideo = async () => {
    if (!selectedVideo) return;
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 3;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("video", selectedVideo);

      const response = await axios.post(`${BACKEND_URL}/detect`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = response.data;
      setAnalysisResult({
        result: data.result || "Unknown",
        score: data.score || 0.5,
        heatmapUrl: `${BACKEND_URL}${data.heatmapUrl}?t=${Date.now()}`,
        framesAnalyzed: data.framesAnalyzed || 30,
        facesDetected: data.facesDetected || 1,
      });
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.response?.data?.error || err.message || "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedVideo(null);
    setVideoPreview(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2 rounded-full mb-4 border border-cyan-500/30">
            <Sparkles className="size-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">
              Enterprise-Grade Video Analysis
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Professional Deepfake
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {" "}Video Detection{" "}
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Advanced frame-by-frame analysis using convolutional neural networks.
            Detect manipulated videos with precision heatmap visualization.
          </p>
        </motion.div>

        <StatsBar />

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                  <Video className="size-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Video Upload</h2>
              </div>
              
              {!selectedVideo ? (
                <VideoUploadZone
                  onVideoSelect={handleVideoSelect}
                  isDragging={isDragging}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                />
              ) : (
                <div className="space-y-5">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gray-700 shadow-lg group bg-black">
                    {videoPreview && (
                      <video src={videoPreview} controls className="w-full h-auto max-h-96">
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  
                  {isAnalyzing && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium">Analyzing frames...</span>
                        <span className="text-cyan-400 font-bold">{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="size-5 text-red-400 mt-0.5" />
                        <div>
                          <h4 className="text-red-400 font-semibold mb-1">Error</h4>
                          <p className="text-sm text-red-300">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={analyzeVideo}
                      disabled={isAnalyzing || !!analysisResult}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-6 rounded-xl shadow-lg disabled:opacity-50"
                    >
                      {isAnalyzing ? "Processing..." : analysisResult ? "Analysis Complete ✓" : "Start Video Analysis"}
                    </Button>
                    <Button
                      onClick={resetAnalysis}
                      variant="outline"
                      disabled={isAnalyzing}
                      className="py-6 px-6 rounded-xl border-2 border-gray-600 hover:border-gray-500 text-gray-300"
                    >
                      <RotateCcw className="size-5" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
            <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl">
              <h3 className="font-semibold text-white mb-5 text-lg">Detection Pipeline</h3>
              <TechnologyStack />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl min-h-[600px]">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                  <Sparkles className="size-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Analysis Report</h2>
              </div>
              
              {!selectedVideo && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Video className="size-16 text-cyan-400 mb-6 opacity-20" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No Video Selected</h3>
                </div>
              )}

              {analysisResult && (
                <VideoAnalysisResult
                  result={analysisResult.result}
                  score={analysisResult.score}
                  heatmapUrl={analysisResult.heatmapUrl}
                  framesAnalyzed={analysisResult.framesAnalyzed}
                  facesDetected={analysisResult.facesDetected}
                />
              ) || isAnalyzing && (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                   <Loader2 className="size-20 text-cyan-400 animate-spin mb-6" />
                   <h3 className="text-lg font-semibold text-white mb-3">Analysis in Progress</h3>
                 </div>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainDetector />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
