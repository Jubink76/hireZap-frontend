import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Briefcase, Calendar, ChevronDown } from 'lucide-react';

const RecruiterDashboardGraph = () => {
  const [selectedMetric, setSelectedMetric] = useState('applications');
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data for different metrics
  const applicationsData = [
    { date: 'Jan 1', applications: 45, hires: 3, interviews: 12 },
    { date: 'Jan 2', applications: 52, hires: 2, interviews: 15 },
    { date: 'Jan 3', applications: 38, hires: 4, interviews: 8 },
    { date: 'Jan 4', applications: 67, hires: 1, interviews: 18 },
    { date: 'Jan 5', applications: 71, hires: 5, interviews: 22 },
    { date: 'Jan 6', applications: 58, hires: 3, interviews: 16 },
    { date: 'Jan 7', applications: 49, hires: 2, interviews: 14 },
  ];

  const hiringFunnelData = [
    { name: 'Applications', value: 1248, color: '#3B82F6' },
    { name: 'Screening', value: 456, color: '#8B5CF6' },
    { name: 'Interviews', value: 189, color: '#10B981' },
    { name: 'Offers', value: 92, color: '#F59E0B' },
    { name: 'Hires', value: 86, color: '#EF4444' },
  ];

  const jobPerformanceData = [
    { job: 'Product Designer', applications: 120, quality: 4.2 },
    { job: 'Backend Engineer', applications: 89, quality: 4.6 },
    { job: 'People Ops Manager', applications: 24, quality: 3.8 },
    { job: 'Frontend Developer', applications: 156, quality: 4.1 },
    { job: 'Data Scientist', applications: 78, quality: 4.4 },
  ];

  const metrics = [
    { key: 'applications', label: 'Applications Over Time', icon: Users },
    { key: 'funnel', label: 'Hiring Funnel', icon: TrendingUp },
    { key: 'performance', label: 'Job Performance', icon: Briefcase },
  ];

  const timeRanges = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 90 Days' },
  ];

  const renderChart = () => {
    switch (selectedMetric) {
      case 'applications':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={applicationsData}>
              <defs>
                <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="hiresGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="applications"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#applicationsGradient)"
                name="Applications"
              />
              <Line
                type="monotone"
                dataKey="hires"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Hires"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'funnel':
        return (
          <div className="flex items-center justify-center h-80">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={hiringFunnelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {hiringFunnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3 ml-6">
              {hiringFunnelData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{item.value}</div>
                    {index > 0 && (
                      <div className="text-sm text-gray-500">
                        {((item.value / hiringFunnelData[index-1].value) * 100).toFixed(1)}% conversion
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="job" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                yAxisId="left"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                yAxisId="left"
                dataKey="applications" 
                fill="#3B82F6" 
                name="Applications"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="quality"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Avg Quality Score"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
          
          {/* Metric Selector */}
          <div className="relative">
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {metrics.map(metric => (
                <option key={metric.key} value={metric.key}>
                  {metric.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.key} value={range.key}>
                  {range.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full">
        {renderChart()}
      </div>

      {/* Quick Insights */}
      {selectedMetric === 'applications' && (
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600">52</div>
            <div className="text-sm text-gray-500">Avg Daily Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">2.9</div>
            <div className="text-sm text-gray-500">Avg Daily Hires</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-purple-600">5.5%</div>
            <div className="text-sm text-gray-500">Conversion Rate</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboardGraph;