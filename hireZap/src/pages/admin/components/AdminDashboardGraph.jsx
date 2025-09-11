import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Building, Calendar, ChevronDown, Filter } from 'lucide-react';

const AdminDashboardGraph = () => {
  const [selectedMetric, setSelectedMetric] = useState('users');
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data for different metrics
  const usersData = [
    { date: 'Jan 1', users: 245, active: 180, new: 12 },
    { date: 'Jan 2', users: 252, active: 195, new: 15 },
    { date: 'Jan 3', users: 238, active: 172, new: 8 },
    { date: 'Jan 4', users: 267, active: 201, new: 18 },
    { date: 'Jan 5', users: 271, active: 215, new: 22 },
    { date: 'Jan 6', users: 258, active: 189, new: 16 },
    { date: 'Jan 7', users: 249, active: 198, new: 14 },
  ];

  const systemMetricsData = [
    { name: 'Active Users', value: 1248, color: '#3B82F6' },
    { name: 'Pending Users', value: 156, color: '#8B5CF6' },
    { name: 'Inactive Users', value: 89, color: '#6B7280' },
    { name: 'Suspended', value: 23, color: '#EF4444' },
  ];

  const departmentData = [
    { dept: 'Engineering', users: 120, activity: 4.2 },
    { dept: 'Marketing', users: 89, activity: 4.6 },
    { dept: 'Sales', users: 156, activity: 3.8 },
    { dept: 'HR', users: 45, activity: 4.1 },
    { dept: 'Finance', users: 78, activity: 4.4 },
  ];

  const metrics = [
    { key: 'users', label: 'User Activity Over Time', icon: Users },
    { key: 'system', label: 'System Overview', icon: TrendingUp },
    { key: 'departments', label: 'Department Analytics', icon: Building },
  ];

  const timeRanges = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 90 Days' },
  ];

  const renderChart = () => {
    switch (selectedMetric) {
      case 'users':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usersData}>
              <defs>
                <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="users"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#usersGradient)"
                name="Total Users"
              />
              <Line
                type="monotone"
                dataKey="active"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Active Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'system':
        return (
          <div className="flex items-center justify-center h-80">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={systemMetricsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {systemMetricsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3 ml-6">
              {systemMetricsData.map((item, index) => (
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
                        {((item.value / systemMetricsData[0].value) * 100).toFixed(1)}% of total
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'departments':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="dept" 
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
                dataKey="users" 
                fill="#3B82F6" 
                name="Users"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="activity"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Activity Score"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
          
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

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
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
      </div>

      {/* Chart Area */}
      <div className="w-full h-80">
        {renderChart()}
      </div>

      {/* Quick Insights */}
      {selectedMetric === 'users' && (
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600">254</div>
            <div className="text-sm text-gray-500">Avg Daily Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">193</div>
            <div className="text-sm text-gray-500">Avg Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-purple-600">76%</div>
            <div className="text-sm text-gray-500">Activity Rate</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardGraph;