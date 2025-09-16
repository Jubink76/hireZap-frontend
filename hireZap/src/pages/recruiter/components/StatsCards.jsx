
import { TrendingUp } from "lucide-react";

const StatusCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-serif font-bold text-slate-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.trend > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      {stat.trend > 0 ? '+' : ''}{stat.trend}%
                    </span>
                    <span className="text-sm text-slate-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  index === 0 ? 'bg-cyan-100' :
                  index === 1 ? 'bg-emerald-100' :
                  index === 2 ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    index === 0 ? 'text-cyan-600' :
                    index === 1 ? 'text-emerald-600' :
                    index === 2 ? 'text-blue-600' : 'text-purple-600'
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

export default StatusCards;