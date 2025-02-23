'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Layout, 
  Share2, 
  CreditCard, 
  Crown,
  TrendingUp,
  Loader2,
  UserPlus,
  DollarSign,
  ChevronRight,
  Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, paymentsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/admin/users'),
          fetch('/api/admin/payments')
        ]);

        if (!statsRes.ok || !usersRes.ok || !paymentsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [statsData, usersData, paymentsData] = await Promise.all([
          statsRes.json(),
          usersRes.json(),
          paymentsRes.json()
        ]);

        setStats(statsData);
        setRecentUsers(usersData.users);
        setRecentPayments(paymentsData.payments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users.total || 0,
      subValue: `${stats?.users.newLast30Days || 0} new in last 30 days`,
      icon: Users,
      color: 'blue',
      link: '/admin/users'
    },
    {
      title: 'Pro Users',
      value: stats?.users.pro || 0,
      subValue: `${stats?.users.proPercentage}% of total users`,
      icon: Crown,
      color: 'yellow',
      link: '/admin/subscriptions'
    },
    {
      title: 'Total Projects',
      value: stats?.projects.total || 0,
      subValue: `${stats?.projects.newLast30Days || 0} new in last 30 days`,
      icon: Layout,
      color: 'indigo',
      link: '/admin/projects'
    },
    {
      title: 'Shared Projects',
      value: stats?.projects.shared || 0,
      subValue: `${stats?.projects.sharedPercentage}% sharing rate`,
      icon: Share2,
      color: 'green',
      link: '/admin/projects'
    },
    {
      title: 'Active Subscriptions',
      value: stats?.subscriptions.active || 0,
      subValue: 'Currently active',
      icon: TrendingUp,
      color: 'purple',
      link: '/admin/subscriptions'
    },
    {
      title: 'Total Payments',
      value: stats?.payments.total || 0,
      subValue: `${stats?.payments.newLast30Days || 0} in last 30 days`,
      icon: CreditCard,
      color: 'pink',
      link: '/admin/payments'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Link href={stat.link} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-sm text-gray-500">{stat.subValue}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
            <Link href="/admin/users">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentUsers?.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Payments</h2>
            <Link href="/admin/payments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentPayments?.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">${payment.amount}</p>
                    <p className="text-sm text-gray-500">{payment.status}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 