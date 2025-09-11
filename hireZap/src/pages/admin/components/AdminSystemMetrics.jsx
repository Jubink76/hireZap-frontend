import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

const AdminSystemMetrics = () => {
  const metrics = [
    {
      label: "Avg. Response Time",
      value: "342 ms",
      trend: -5.1,
      trendLabel: "faster",
      icon: Activity
    },
    {
      label: "Uptime", 
      value: "99.98%",
      trend: 0.01,
      trendLabel: "",
      icon: TrendingUp
    },
    {
      label: "Error Rate",
      value: "0.12%", 
      trend: 0.03,
      trendLabel: "",
      icon: Activity
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isNegative = metric.trend > 0 && metric.label === "Error Rate";
        const isPositive = metric.trend < 0 && metric.label === "Avg. Response Time";
        
        return (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-600">{metric.label}</div>
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</div>
            <div className="flex items-center">
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isNegative 
                  ? 'bg-red-100 text-red-600'
                  : isPositive 
                  ? 'bg-green-100 text-green-600'
                  : metric.trend > 0 
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <TrendingUp className={`h-3 w-3 mr-1 ${isNegative || (metric.trend < 0 && metric.label !== "Avg. Response Time") ? 'transform rotate-180' : ''}`} />
                {metric.trend > 0 && metric.label !== "Error Rate" ? '+' : ''}{metric.trend}% {metric.trendLabel}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminSystemMetrics;