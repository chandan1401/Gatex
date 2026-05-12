import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, Zap, Activity, Trash2 } from 'lucide-react'
import MainLayout from '../components/Layout'
import { StatCard, Card, Button } from '../components/CommonComponents'
import { TrafficLineChart, CacheRatioChart } from '../components/Charts'
import { formatBytes, formatNumber } from '../utils/helpers'

const RedisPage = ({ user }) => {
  const [redisMetrics, setRedisMetrics] = useState({
    cacheHitRate: 87.5,
    cacheMissRate: 12.5,
    memoryUsed: 256 * 1024 * 1024,
    memoryMax: 512 * 1024 * 1024,
    connectedClients: 42,
    commandsPerSecond: 1250,
  })

  const [chartData] = useState({
    hitMiss: [
      { name: 'Hits', value: 87.5 },
      { name: 'Misses', value: 12.5 },
    ],
    memory: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      used: Math.floor(Math.random() * 300) + 150,
    })),
  })

  const [topKeys, setTopKeys] = useState([
    { key: 'user:123:profile', size: 2048, hits: 1250, ttl: 3600 },
    { key: 'order:456:details', size: 4096, hits: 890, ttl: 1800 },
    { key: 'cache:api:users', size: 1024, hits: 2100, ttl: 7200 },
    { key: 'session:user:789', size: 512, hits: 450, ttl: 900 },
    { key: 'ratelimit:ip:192.168.1.1', size: 256, hits: 5200, ttl: 60 },
  ])

  return (
    <MainLayout user={user}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Redis Cache Analytics</h1>
        <p className="text-white/60">Monitor and manage distributed caching</p>
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
            icon={Activity}
            label="Cache Hit Rate"
            value={redisMetrics.cacheHitRate}
            unit="%"
            color="cyan"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <StatCard
            icon={Database}
            label="Memory Usage"
            value={formatBytes(redisMetrics.memoryUsed)}
            color="purple"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <StatCard
            icon={Zap}
            label="Connected Clients"
            value={redisMetrics.connectedClients}
            color="green"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <StatCard
            icon={Activity}
            label="Commands/Sec"
            value={formatNumber(redisMetrics.commandsPerSecond)}
            color="orange"
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
          <h3 className="text-lg font-semibold text-white mb-4">Cache Hit/Miss Ratio</h3>
          <CacheRatioChart data={chartData.hitMiss} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Memory Usage (24h)</h3>
          <TrafficLineChart data={chartData.memory} />
        </Card>
      </motion.div>

      {/* Top Keys */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Top Cached Keys</h3>
            <Button variant="secondary" size="sm">
              <Trash2 size={16} className="mr-2" />
              Clear All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white/70">Key</th>
                  <th className="px-4 py-3 text-left text-white/70">Size</th>
                  <th className="px-4 py-3 text-left text-white/70">Hits</th>
                  <th className="px-4 py-3 text-left text-white/70">TTL (s)</th>
                  <th className="px-4 py-3 text-left text-white/70">Action</th>
                </tr>
              </thead>
              <tbody>
                {topKeys.map((key, index) => (
                  <motion.tr
                    key={key.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-4 py-4 text-white/80 font-mono text-xs">{key.key}</td>
                    <td className="px-4 py-4 text-white/60">{formatBytes(key.size)}</td>
                    <td className="px-4 py-4 text-cyan-400 font-semibold">{formatNumber(key.hits)}</td>
                    <td className="px-4 py-4 text-white/60">{key.ttl}</td>
                    <td className="px-4 py-4">
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={16} />
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

export default RedisPage
