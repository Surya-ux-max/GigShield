import React, { useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { FaUsers, FaClipboard, FaCheckCircle, FaExclamationTriangle, FaChartLine, FaClock } from 'react-icons/fa'
import { useData, loadDashboardStats } from '../stores'

const AdminDashboard: React.FC = () => {
  const { stats, loading } = useData()

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const chartData = [
    { name: 'Jan', workers: 120, subscriptions: 100, claims: 8 },
    { name: 'Feb', workers: 135, subscriptions: 115, claims: 12 },
    { name: 'Mar', workers: 150, subscriptions: 120, claims: 15 },
    { name: 'Apr', workers: 165, subscriptions: 135, claims: 18 },
    { name: 'May', workers: 180, subscriptions: 150, claims: 22 },
    { name: 'Jun', workers: 200, subscriptions: 170, claims: 25 },
  ]

  const pieData = [
    { name: 'Verified', value: 45 },
    { name: 'Approved', value: 25 },
    { name: 'Paid', value: 30 },
  ]

  const COLORS = ['#06b6d4', '#a855f7', '#10b981']

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { icon: string; border: string } } = {
      blue: { icon: 'text-cyan-300', border: 'border-cyan-500' },
      green: { icon: 'text-green-300', border: 'border-green-500' },
      orange: { icon: 'text-orange-300', border: 'border-orange-500' },
      red: { icon: 'text-red-300', border: 'border-red-500' },
    }
    return colors[color] || colors.blue
  }

  const statCards = [
    { title: 'Total Workers', value: stats?.total_workers || 0, icon: FaUsers, color: 'blue', change: '+12.5%' },
    { title: 'Active Subscriptions', value: stats?.active_subscriptions || 0, icon: FaCheckCircle, color: 'green', change: '+8.2%' },
    { title: 'Total Claims', value: stats?.total_claims || 0, icon: FaClipboard, color: 'orange', change: '+5.1%' },
    { title: 'Fraud Detected', value: stats?.fraud_detected || 0, icon: FaExclamationTriangle, color: 'red', change: '+2.3%' },
  ]

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-slate-300 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-4">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="text-slate-400 text-lg">Real-time insights and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="stat-grid mb-8">
          {statCards.map((stat, i) => {
            const Icon = stat.icon
            const colors = getColorClasses(stat.color)
            return (
              <div key={i} className={`stat-card border-t-4 ${colors.border} group`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                    <p className={`text-sm font-semibold mt-2 ${colors.icon}`}>{stat.change}</p>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${colors.icon} bg-opacity-10`}
                    style={{ backgroundColor: stat.color === 'blue' ? 'rgba(6,182,212,0.1)' : stat.color === 'green' ? 'rgba(16,185,129,0.1)' : stat.color === 'orange' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)' }}>
                    <Icon />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="dashboard-card">
            <h2 className="dashboard-header">Monthly Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ background: 'rgba(30,27,75,0.9)', border: '1px solid #06b6d4', borderRadius: '8px' }}
                  labelStyle={{ color: '#06b6d4' }}
                />
                <Legend />
                <Bar dataKey="workers" fill="#06b6d4" />
                <Bar dataKey="subscriptions" fill="#a855f7" />
                <Bar dataKey="claims" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="dashboard-card">
            <h2 className="dashboard-header">Claims Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(30,27,75,0.9)', border: '1px solid #06b6d4', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="dashboard-card mb-6">
          <h2 className="dashboard-header">Claims Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: 'rgba(30,27,75,0.9)', border: '1px solid #06b6d4', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="claims" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FaClock, label: 'Avg Payout Time', value: '2.5 hours', color: 'cyan' },
            { icon: FaChartLine, label: 'Success Rate', value: '98.5%', color: 'green' },
            { icon: FaCheckCircle, label: 'Pending Claims', value: stats?.pending_claims || 0, color: 'purple' },
          ].map((metric, i) => {
            const Icon = metric.icon
            return (
              <div key={i} className="dashboard-card text-center">
                <Icon className={`text-3xl mx-auto mb-3 ${metric.color === 'cyan' ? 'text-cyan-300' : metric.color === 'green' ? 'text-green-300' : 'text-purple-300'}`} />
                <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
