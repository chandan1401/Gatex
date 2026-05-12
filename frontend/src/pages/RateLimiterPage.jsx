import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, AlertTriangle, Shield, TrendingUp } from 'lucide-react'
import MainLayout from '../components/Layout'
import { StatCard, Card, Badge, Button } from '../components/CommonComponents'
import { ErrorRateChart, TrafficLineChart } from '../components/Charts'

const RateLimiterPage = ({ user }) => {
  const [rateMetrics] = useState({
    requestsPerMinute: 6200,
    limitPerMinute: 10000,
    blockedRequests: 142,
    activeIPs: 2340,
  })

  const [blockedIPs] = useState([
    { ip: '203.0.113.45', requests: 2500, limit: 100, status: 'blocked', since: '2 hours ago' },
    { ip: '198.51.100.89', requests: 1800, limit: 100, status: 'blocked', since: '30 minutes ago' },
    { ip: '192.0.2.123', requests: 950, limit: 100, status: 'warning', since: '5 minutes ago' },
  ])

  const [rateData] = useState(
    Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      requests: Math.floor(Math.random() * 8000) + 2000,
    }))
  )

  return (
    <MainLayout user={user}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Rate Limiting & Security</h1>
        <p className="text-white/60">Monitor and manage API rate limiting and DDoS protection</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <StatCard
            icon={TrendingUp}
            label="Requests/Min"
            value="6,200"
            unit="/ 10k"
            color="cyan"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <StatCard
            icon={AlertTriangle}
            label="Blocked Requests"
            value="142"
            unit="24h"
            trend={8}
            color="orange"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <StatCard
            icon={Shield}
            label="Active IPs"
            value="2,340"
            color="purple"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <StatCard
            icon={Zap}
            label="Limit Usage"
            value="62"
            unit="%"
            color="green"
          />
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Request Rate (24h)</h3>
          <TrafficLineChart data={rateData} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Limit Status by IP</h3>
          <div className="space-y-3">
            {[30, 60, 85].map((usage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-white/60">
                  <span>IP {idx + 1}</span>
                  <span>{usage}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${usage}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${
                      usage > 80
                        ? 'bg-red-500'
                        : usage > 50
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Blocked IPs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Blocked & Limited IPs</h3>
            <Button variant="secondary" size="sm">Reset</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white/70">IP Address</th>
                  <th className="px-4 py-3 text-left text-white/70">Requests</th>
                  <th className="px-4 py-3 text-left text-white/70">Limit</th>
                  <th className="px-4 py-3 text-left text-white/70">Status</th>
                  <th className="px-4 py-3 text-left text-white/70">Blocked Since</th>
                  <th className="px-4 py-3 text-left text-white/70">Action</th>
                </tr>
              </thead>
              <tbody>
                {blockedIPs.map((blocked, idx) => (
                  <motion.tr
                    key={blocked.ip}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-4 py-4 text-white/80 font-mono text-xs">{blocked.ip}</td>
                    <td className="px-4 py-4 text-white/60">{blocked.requests}</td>
                    <td className="px-4 py-4 text-white/60">{blocked.limit}</td>
                    <td className="px-4 py-4">
                      <Badge variant={blocked.status === 'blocked' ? 'error' : 'warning'}>
                        {blocked.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-white/60 text-xs">{blocked.since}</td>
                    <td className="px-4 py-4">
                      <button className="text-cyan-400 hover:text-cyan-300 text-xs font-medium">
                        Whitelist
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default RateLimiterPage
