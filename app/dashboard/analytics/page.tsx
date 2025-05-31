"use client";
import { useState, useEffect } from 'react';
import { useLinkProfile } from '@/contexts/LinkProfileContext';
import { LinkProfile } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';
import { FiEye, FiMousePointer, FiClock, FiTrendingUp } from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsDashboard() {
  const { profiles, currentProfile, loading } = useLinkProfile();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    if (currentProfile) {
      // In a real app, you would fetch analytics data from your backend
      // For now, we'll use mock data
      const mockData = generateMockAnalyticsData(timeRange);
      setAnalyticsData(mockData);
    }
  }, [currentProfile, timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Profile Selected</h1>
          <p className="text-gray-600">Please select a profile to view analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range as '7d' | '30d' | '90d')}
                className={`px-4 py-2 rounded-md ${
                  timeRange === range
                    ? 'bg-purple text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={analyticsData?.totalViews || 0}
            icon={<FiEye className="w-6 h-6" />}
            trend={analyticsData?.viewsTrend || 0}
          />
          <StatCard
            title="Total Clicks"
            value={analyticsData?.totalClicks || 0}
            icon={<FiMousePointer className="w-6 h-6" />}
            trend={analyticsData?.clicksTrend || 0}
          />
          <StatCard
            title="Average Time"
            value={`${analyticsData?.avgTimeOnPage || 0}s`}
            icon={<FiClock className="w-6 h-6" />}
            trend={analyticsData?.timeTrend || 0}
          />
          <StatCard
            title="Conversion Rate"
            value={`${analyticsData?.conversionRate || 0}%`}
            icon={<FiTrendingUp className="w-6 h-6" />}
            trend={analyticsData?.conversionTrend || 0}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Over Time */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Traffic Over Time</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData?.trafficData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" />
                  <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Platform Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData?.platformData || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {(analyticsData?.platformData || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Performing Links */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Top Performing Links</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.topLinks || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <div className="text-purple">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
        <p className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </p>
      </div>
    </motion.div>
  );
}

// Mock data generator
function generateMockAnalyticsData(timeRange: '7d' | '30d' | '90d') {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const trafficData = Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    views: Math.floor(Math.random() * 1000),
    clicks: Math.floor(Math.random() * 500)
  }));

  const platformData = [
    { name: 'Twitter', value: 400 },
    { name: 'Instagram', value: 300 },
    { name: 'LinkedIn', value: 200 },
    { name: 'GitHub', value: 100 },
    { name: 'Other', value: 50 }
  ];

  const topLinks = [
    { name: 'Portfolio', clicks: 400 },
    { name: 'GitHub', clicks: 300 },
    { name: 'LinkedIn', clicks: 200 },
    { name: 'Twitter', clicks: 150 },
    { name: 'Blog', clicks: 100 }
  ];

  return {
    totalViews: trafficData.reduce((sum, day) => sum + day.views, 0),
    totalClicks: trafficData.reduce((sum, day) => sum + day.clicks, 0),
    avgTimeOnPage: Math.floor(Math.random() * 60) + 30,
    conversionRate: Math.floor(Math.random() * 20) + 5,
    viewsTrend: Math.floor(Math.random() * 20) - 5,
    clicksTrend: Math.floor(Math.random() * 20) - 5,
    timeTrend: Math.floor(Math.random() * 20) - 5,
    conversionTrend: Math.floor(Math.random() * 20) - 5,
    trafficData,
    platformData,
    topLinks
  };
} 