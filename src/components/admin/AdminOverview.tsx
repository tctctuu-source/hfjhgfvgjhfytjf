import React from 'react';
import { Users, Trophy, Newspaper, Image, TrendingUp, Calendar } from 'lucide-react';

const AdminOverview: React.FC = () => {
  const stats = [
    {
      name: 'Total Results',
      value: '156',
      change: '+12%',
      changeType: 'increase',
      icon: Trophy,
      color: 'bg-yellow-500'
    },
    {
      name: 'News Articles',
      value: '24',
      change: '+3',
      changeType: 'increase',
      icon: Newspaper,
      color: 'bg-blue-500'
    },
    {
      name: 'Gallery Photos',
      value: '342',
      change: '+28',
      changeType: 'increase',
      icon: Image,
      color: 'bg-green-500'
    },
    {
      name: 'Contact Messages',
      value: '89',
      change: '+15',
      changeType: 'increase',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  const recentActivity = [
    {
      action: 'New result added',
      description: 'Poetry Competition - Winner: Arjun Menon',
      time: '2 hours ago',
      type: 'result'
    },
    {
      action: 'News article published',
      description: 'Registration Now Open for Muhimmath 2025',
      time: '4 hours ago',
      type: 'news'
    },
    {
      action: 'Gallery updated',
      description: '15 new photos added from previous event',
      time: '6 hours ago',
      type: 'gallery'
    },
    {
      action: 'Contact message received',
      description: 'New inquiry about participation',
      time: '8 hours ago',
      type: 'contact'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to the Muhimmath admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{stat.change}</span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'result' ? 'bg-yellow-100 text-yellow-600' :
                    activity.type === 'news' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'gallery' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'result' ? '🏆' :
                     activity.type === 'news' ? '📰' :
                     activity.type === 'gallery' ? '📸' : '💬'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Result</p>
              <p className="text-xs text-gray-500">Add new competition result</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Newspaper className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-sm font-medium text-gray-900">Create News</p>
              <p className="text-xs text-gray-500">Publish new article</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Image className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-sm font-medium text-gray-900">Upload Photos</p>
              <p className="text-xs text-gray-500">Add to gallery</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Calendar className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-sm font-medium text-gray-900">Schedule Event</p>
              <p className="text-xs text-gray-500">Add upcoming event</p>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-900">Website</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-900">Database</p>
            <p className="text-xs text-gray-500">Connected</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-900">Backup</p>
            <p className="text-xs text-gray-500">Scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
