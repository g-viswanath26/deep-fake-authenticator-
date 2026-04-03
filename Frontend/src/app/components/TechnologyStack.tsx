import { Brain, Zap, Lock } from "lucide-react";

export function TechnologyStack() {
  const technologies = [
    {
      icon: Brain,
      title: "Face Detection",
      description: "Multi-face detection with OpenCV and deep learning",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: Zap,
      title: "CNN Architecture",
      description: "Convolutional neural network with heatmap generation",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Lock,
      title: "Secure Processing",
      description: "Local processing with encrypted data transmission",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {technologies.map((tech, index) => (
        <div
          key={index}
          className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className={`bg-gradient-to-br ${tech.gradient} p-3 rounded-lg shadow-lg`}>
              <tech.icon className="size-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">
                {tech.title}
              </h4>
              <p className="text-sm text-gray-400">
                {tech.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
