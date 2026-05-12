import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Activity, AlertTriangle, Shield } from 'lucide-react'
import MainLayout from '../components/Layout'
import { StatCard, Card, Badge } from '../components/CommonComponents'
import { TrafficLineChart, ErrorRateChart } from '../components/Charts'

const TrafficMonitorPage = ({ user }) => {
  const [trafficData] = useState({
    traffic: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      requests: Math.floor(Math.random() * 8000) + 3000,
    })),
    errors: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      errorRate: Math.floor(Math.random() * 5),
    })),
  })

  const [liveRequests] = useState([
    { id: 1, method: 'GET', path: '/api/users', status: 200, client: '192.168.1.100', time: 'now' },
    { id: 2, method: 'POST', path: '/api/orders', status: 201, client: '192.168.1.101', time: '2s ago' },
    { id: 3, method: 'GET', path: '/api/payments', status: 200, client: '192.168.1.102', time: '5s ago' },
    { id: 4, method: 'PUT', path: '/api/users/1', status: 200, client: '192.168.1.103', time: '8s ago' },
  ])

  const [services] = useState([
    { name: 'Auth Service', requests: 1240, avgTime: 45, status: 'healthy', uptime: 99.99 },
    { name: 'User Service', requests: 890, avgTime: 78, status: 'healthy', uptime: 99.95 },
    { name: 'Order Service', requests: 2340, avgTime: 120, status: 'healthy', uptime: 99.98 },
    { name: 'Payment Service', requests: 450, avgTime: 256, status: 'degraded', uptime: 99.70 },
  ])

  return (
    <MainLayout user={user}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Traffic Monitor</h1>
        <p className="text-white/60">Real-time API traffic and service communication</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <StatCard
            icon={TrendingUp}
            label="Total Requests"
            value="1,245.8k"
            unit="24h"
            color="cyan"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <StatCard
            icon={Activity}
            label="Active Connections"
            value="342"
            color="purple"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <StatCard
            icon={AlertTriangle}
            label="Error Rate"
            value="2.3"
            unit="%"
            trend={-1}
            color="orange"
          />
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">API Traffic (24h)</h3>
          <TrafficLineChart data={trafficData.traffic} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Error Rate (24h)</h3>
          <ErrorRateChart data={trafficData.errors} />
        </Card>
      </motion.div>

      {/* Live Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Live Stream */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Live Request Stream</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {liveRequests.map((req, idx) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="info" size="sm">{req.method}</Badge>
                    <span className="text-white/80 font-mono text-xs">{req.path}</span>
                  </div>
                  <p className="text-white/40 text-xs">{req.client}</p>
                </div>
                <div className="text-right">
                  <Badge variant={req.status === 200 ? 'success' : 'warning'} size="sm">
                    {req.status}
                  </Badge>
                  <p className="text-white/40 text-xs mt-1">{req.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Service Stats */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Service Performance</h3>
          <div className="space-y-3">
            {services.map((svc, idx) => (
              <motion.div
                key={svc.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{svc.name}</span>
                  <Badge variant={svc.status === 'healthy' ? 'success' : 'warning'} size="sm">
                    {svc.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-white/50">Requests</p>
                    <p className="text-cyan-400 font-semibold">{svc.requests}</p>
                  </div>
                  <div>
                    <p className="text-white/50">Avg Time</p>
                    <p className="text-purple-400 font-semibold">{svc.avgTime}ms</p>
                  </div>
                  <div>
                    <p className="text-white/50">Uptime</p>
                    <p className="text-green-400 font-semibold">{svc.uptime}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default TrafficMonitorPage
