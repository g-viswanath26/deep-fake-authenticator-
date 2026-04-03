import { TrendingUp, Zap, Database, Users } from "lucide-react";

export function StatsBar() {
  const stats = [
    {
      icon: Database,
      label: "Videos Analyzed",
      value: "156K+",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
    },
    {
      icon: Zap,
      label: "Accuracy Rate",
      value: "98.7%",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      icon: TrendingUp,
      label: "Avg Processing",
      value: "<3.5s",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      icon: Users,
      label: "Enterprise Clients",
      value: "2.4K+",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all hover:scale-105`}
        >
          <div className="flex items-center gap-3">
            <div className={`${stat.color} ${stat.bgColor} p-2 rounded-lg border ${stat.borderColor}`}>
              <stat.icon className="size-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
