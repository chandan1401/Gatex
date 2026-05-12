import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Zap, AlertCircle, Activity, Cpu, Database, Network } from 'lucide-react'
import StatusIndicator from './StatusIndicator'
import MetricsCard from './MetricsCard'

const InfrastructurePanel = () => {
  const [metrics, setMetrics] = useState({
    apiRequests: Array.from({ length: 12 }, (_, i) => ({ name: `${i}:00`, value: Math.floor(Math.random() * 10000) })),
    latency: Array.from({ length: 12 }, (_, i) => ({ name: `${i}:00`, value: Math.floor(Math.random() * 500) })),
    microservices: [
      { name: 'Auth Service', value: 35, fill: '#6366F1' },
      { name: 'API Service', value: 45, fill: '#8B5CF6' },
      { name: 'Cache Service', value: 20, fill: '#06B6D4' },
    ],
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 h-full">
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">GateX</h1>
        </div>
        <p className="text-gray-400 text-sm">Enterprise API Gateway Platform</p>
        <div className="flex items-center gap-2 pt-2">
          <StatusIndicator status="online" />
          <span className="text-xs text-gray-500">All systems operational</span>
        </div>
      </motion.div>

      {/* Live Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <MetricsCard icon={Activity} label="API Requests" value="2.4M" change="+12%" positive />
        <MetricsCard icon={Cpu} label="CPU Load" value="32%" change="+2%" positive={false} />
        <MetricsCard icon={Database} label="Latency" value="45ms" change="-8%" positive />
        <MetricsCard icon={Network} label="Throughput" value="1.2GB/s" change="+5%" positive />
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        {/* API Throughput Chart */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors">
          <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">API Throughput</h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={metrics.apiRequests}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Latency Chart */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors">
          <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">Response Latency</h3>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={metrics.latency}>
              <Line type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Microservices Distribution */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors">
          <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">Microservices Traffic</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={metrics.microservices} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" isAnimationActive={false}>
                {metrics.microservices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Security & Alerts */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Active Alerts</h3>
        <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-600/30 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-amber-200 font-medium">High traffic detected</p>
            <p className="text-xs text-amber-400/60">Peak usage in last 5 minutes</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default InfrastructurePanel
