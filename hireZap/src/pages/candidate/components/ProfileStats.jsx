import React from 'react';
import { FileText, CheckCircle, Clock, Award, TrendingUp } from 'lucide-react';

const ProfileStats = ({ stats }) => {
  // Define stats with icons and trend data
  const statsData = [
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      trend: 12,
      colorIndex: 0
    },
    {
      label: "Hired",
      value: stats.hired,
      icon: CheckCircle,
      trend: 8,
      colorIndex: 1
    },
    {
      label: "In Progress", 
      value: stats.inProgress,
      icon: Clock,
      trend: -2,
      colorIndex: 2
    },
    {
      label: "Tests Completed",
      value: stats.testsCompleted,
      icon: Award,
      trend: 15,
      colorIndex: 3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-serif font-bold text-slate-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.trend > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-4 h-4 inline mr-1 ${
                        stat.trend < 0 ? 'rotate-180' : ''
                      }`} />
                      {stat.trend > 0 ? '+' : ''}{stat.trend}%
                    </span>
                    <span className="text-sm text-slate-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg flex-shrink-0 ml-4 ${
                  stat.colorIndex === 0 ? 'bg-cyan-100' :
                  stat.colorIndex === 1 ? 'bg-emerald-100' :
                  stat.colorIndex === 2 ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    stat.colorIndex === 0 ? 'text-cyan-600' :
                    stat.colorIndex === 1 ? 'text-emerald-600' :
                    stat.colorIndex === 2 ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileStats;