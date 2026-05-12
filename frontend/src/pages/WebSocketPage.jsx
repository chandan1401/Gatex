import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, CheckCircle, AlertCircle } from 'lucide-react'
import MainLayout from '../components/Layout'
import { Card, Badge, Button } from '../components/CommonComponents'

const WebSocketPage = ({ user }) => {
  const [wsMetrics] = useState({
    activeConnections: 342,
    totalConnected: 1520,
    messagesPerSecond: 2450,
    avgLatency: 12,
  })

  const [connections] = useState([
    { id: 'ws-1', client: '192.168.1.100', status: 'connected', connected: '2h ago', messages: 1250 },
    { id: 'ws-2', client: '192.168.1.101', status: 'connected', connected: '1h 30m ago', messages: 890 },
    { id: 'ws-3', client: '192.168.1.102', status: 'disconnected', connected: '30m ago', messages: 450 },
    { id: 'ws-4', client: '192.168.1.103', status: 'connected', connected: '45m ago', messages: 2100 },
    { id: 'ws-5', client: '192.168.1.104', status: 'connected', connected: '1h ago', messages: 1580 },
  ])

  const [rooms] = useState([
    { name: 'user-updates', members: 45, messages: '5.2k/h' },
    { name: 'order-notifications', members: 28, messages: '2.1k/h' },
    { name: 'payment-alerts', members: 12, messages: '890/h' },
    { name: 'api-status', members: 156, messages: '12.5k/h' },
  ])

  return (
    <MainLayout user={user}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">WebSocket Monitor</h1>
        <p className="text-white/60">Real-time bidirectional communication monitoring</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Card className="h-full flex flex-col justify-between">
            <div>
              <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
                <Zap size={16} className="text-cyan-400" /> Active Connections
              </p>
              <p className="text-3xl font-bold text-cyan-400">{wsMetrics.activeConnections}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="h-full flex flex-col justify-between">
            <div>
              <p className="text-white/60 text-sm mb-2">Total Connected</p>
              <p className="text-3xl font-bold text-purple-400">{wsMetrics.totalConnected}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="h-full flex flex-col justify-between">
            <div>
              <p className="text-white/60 text-sm mb-2">Messages/Sec</p>
              <p className="text-3xl font-bold text-green-400">{wsMetrics.messagesPerSecond}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="h-full flex flex-col justify-between">
            <div>
              <p className="text-white/60 text-sm mb-2">Avg Latency</p>
              <p className="text-3xl font-bold text-orange-400">{wsMetrics.avgLatency}ms</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Connections & Rooms */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Active Connections */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Active Connections</h3>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-white/5 border-b border-white/10 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-white/70">ID</th>
                  <th className="px-3 py-2 text-left text-white/70">Client IP</th>
                  <th className="px-3 py-2 text-left text-white/70">Status</th>
                  <th className="px-3 py-2 text-left text-white/70">Connected</th>
                  <th className="px-3 py-2 text-left text-white/70">Messages</th>
                </tr>
              </thead>
              <tbody>
                {connections.map((conn, idx) => (
                  <motion.tr
                    key={conn.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-3 py-2 text-white/80 font-mono">{conn.id}</td>
                    <td className="px-3 py-2 text-white/60 font-mono">{conn.client}</td>
                    <td className="px-3 py-2">
                      <Badge variant={conn.status === 'connected' ? 'success' : 'error'}>
                        {conn.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-white/60">{conn.connected}</td>
                    <td className="px-3 py-2 text-cyan-400 font-semibold">{conn.messages}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Rooms/Topics */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Communication Channels</h3>
          <div className="space-y-3">
            {rooms.map((room, idx) => (
              <motion.div
                key={room.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium font-mono text-sm">{room.name}</p>
                    <p className="text-white/40 text-xs mt-1">{room.members} members</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-semibold text-sm">{room.messages}</p>
                    <p className="text-white/40 text-xs">messages</p>
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

export default WebSocketPage
