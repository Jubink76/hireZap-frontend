import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const RecentUsers = () => {
  const users = [
    {
      id: 1,
      name: "Ava Thompson",
      email: "ava.t@example.com",
      company: "Acme Inc.",
      role: "Recruiter",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Liam Patel",
      email: "liam.p@example.com", 
      company: "Globex",
      role: "Candidate",
      status: "Pending",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Mia Rodriguez",
      email: "mia.r@example.com",
      company: "Initech", 
      role: "Admin",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Noah Kim",
      email: "noah.k@example.com",
      company: "Soylent",
      role: "Candidate", 
      status: "Pending",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
        <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 hover:border border-teal-600 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className="text-sm text-gray-500">{user.company} • {user.role}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                user.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.status}
              </span>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;