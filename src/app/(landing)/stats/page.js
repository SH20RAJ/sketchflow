'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Layout, 
  Share2, 
  CreditCard, 
  Crown,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users.total || 0,
      subValue: `${stats?.users.newLast30Days || 0} new in last 30 days`,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Pro Users',
      value: stats?.users.pro || 0,
      subValue: `${stats?.users.proPercentage}% of total users`,
      icon: Crown,
      color: 'yellow'
    },
    {
      title: 'Total Projects',
      value: stats?.projects.total || 0,
      subValue: `${stats?.projects.newLast30Days || 0} new in last 30 days`,
      icon: Layout,
      color: 'indigo'
    },
    {
      title: 'Shared Projects',
      value: stats?.projects.shared || 0,
      subValue: `${stats?.projects.sharedPercentage}% sharing rate`,
      icon: Share2,
      color: 'green'
    },
    {
      title: 'Active Subscriptions',
      value: stats?.subscriptions.active || 0,
      subValue: 'Currently active',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Total Payments',
      value: stats?.payments.total || 0,
      subValue: `${stats?.payments.newLast30Days || 0} in last 30 days`,
      icon: CreditCard,
      color: 'pink'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
            Platform Statistics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Overview of platform metrics and performance indicators
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">{stat.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                <span className="text-sm text-gray-500">{stat.subValue}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
