import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Cpu, HardDrive, Zap, AlertCircle, CheckCircle, TrendingUp, ArrowUpRight } from 'lucide-react'
import MainLayout from '../components/Layout'
import { StatCard, Card } from '../components/CommonComponents'
import { TrafficLineChart, ResponseTimeChart, ErrorRateChart, CacheRatioChart, CPUMemoryChart } from '../components/Charts'
import { formatNumber, formatBytes } from '../utils/helpers'
import { useNotification } from '../context/NotificationContext'

const DashboardPage = ({ user }) => {
  const [metrics, setMetrics] = useState({
    activeRequests: 1243,
    throughput: 5230,
    avgResponseTime: 142,
    errorRate: 2.3,
    cacheHitRate: 87.5,
    totalServices: 4,
    uptime: 99.97,
    cpuUsage: 45,
    memoryUsage: 62,
  })

  const [chartData] = useState({
    traffic: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      requests: Math.floor(Math.random() * 5000) + 2000,
    })),
    responseTime: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      responseTime: Math.floor(Math.random() * 200) + 50,
    })),
    errorRate: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      errorRate: Math.floor(Math.random() * 5),
    })),
    cache: [
      { name: 'Hits', value: 87.5 },
      { name: 'Misses', value: 12.5 },
    ],
    cpuMemory: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
    })),
  })

  const { success, info } = useNotification()

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeRequests: Math.floor(Math.random() * 2000) + 500,
        throughput: Math.floor(Math.random() * 10000) + 2000,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <MainLayout user={user}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-white/60">Real-time API Gateway monitoring and analytics</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={Activity}
            label="Active Requests"
            value={formatNumber(metrics.activeRequests)}
            trend={12}
            color="cyan"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={Zap}
            label="API Throughput"
            value={formatNumber(metrics.throughput)}
            unit="req/s"
            trend={8}
            color="purple"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={TrendingUp}
            label="Avg Response Time"
            value={metrics.avgResponseTime}
            unit="ms"
            trend={-5}
            color="green"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={AlertCircle}
            label="Error Rate"
            value={metrics.errorRate}
            unit="%"
            trend={-2}
            color="orange"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={HardDrive}
            label="Cache Hit Rate"
            value={metrics.cacheHitRate}
            unit="%"
            trend={15}
            color="cyan"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={CheckCircle}
            label="System Uptime"
            value={metrics.uptime}
            unit="%"
            trend={0}
            color="green"
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Traffic */}
        <Card className="col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="text-cyan-400" size={24} />
            API Traffic (24h)
          </h3>
          <TrafficLineChart data={chartData.traffic} />
        </Card>

        {/* Response Time */}
        <Card className="col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-purple-400" size={24} />
            Response Time (24h)
          </h3>
          <ResponseTimeChart data={chartData.responseTime} />
        </Card>

        {/* Error Rate */}
        <Card className="col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="text-orange-400" size={24} />
            Error Rate (24h)
          </h3>
          <ErrorRateChart data={chartData.errorRate} />
        </Card>

        {/* Cache Hit Rate */}
        <Card className="col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <HardDrive className="text-cyan-400" size={24} />
            Cache Hit Ratio
          </h3>
          <CacheRatioChart data={chartData.cache} />
        </Card>
      </motion.div>

      {/* CPU & Memory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="text-purple-400" size={24} />
            System Resource Usage
          </h3>
          <CPUMemoryChart data={chartData.cpuMemory} />
        </Card>
      </motion.div>

      {/* Status Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
      >
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">System Status</p>
              <p className="text-2xl font-bold text-green-400">All Systems Operational</p>
              <p className="text-white/40 text-xs mt-2">Uptime: 99.97%</p>
            </div>
            <CheckCircle size={48} className="text-green-400/30" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Connected Services</p>
              <p className="text-2xl font-bold text-cyan-400">{metrics.totalServices}/4 Healthy</p>
              <p className="text-white/40 text-xs mt-2">No degradation</p>
            </div>
            <Activity size={48} className="text-cyan-400/30" />
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default DashboardPage
