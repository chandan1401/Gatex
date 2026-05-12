import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Archive, Filter, Download, Clock, Trash2 } from 'lucide-react'
import MainLayout from '../components/Layout'
import { Card, Badge, Button } from '../components/CommonComponents'
import { formatTime, getMethodColor, getStatusCodeColor } from '../utils/helpers'

const LogsPage = ({ user }) => {
  const [logs, setLogs] = useState([
    { id: 1, timestamp: Date.now() - 1000, method: 'GET', path: '/api/users', status: 200, responseTime: 45, ip: '192.168.1.100' },
    { id: 2, timestamp: Date.now() - 5000, method: 'POST', path: '/api/orders', status: 201, responseTime: 120, ip: '192.168.1.101' },
    { id: 3, timestamp: Date.now() - 10000, method: 'PUT', path: '/api/users/1', status: 200, responseTime: 78, ip: '192.168.1.100' },
    { id: 4, timestamp: Date.now() - 15000, method: 'DELETE', path: '/api/orders/1', status: 204, responseTime: 56, ip: '192.168.1.102' },
    { id: 5, timestamp: Date.now() - 20000, method: 'GET', path: '/api/payments/1', status: 500, responseTime: 500, ip: '192.168.1.103' },
  ])
  const [filter, setFilter] = useState('')
  const [scrollToBottom, setScrollToBottom] = useState(true)

  useEffect(() => {
    // Simulate new logs
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        timestamp: Date.now(),
        method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
        path: ['/api/users', '/api/orders', '/api/payments'][Math.floor(Math.random() * 3)],
        status: [200, 201, 204, 400, 401, 404, 500][Math.floor(Math.random() * 7)],
        responseTime: Math.floor(Math.random() * 500),
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      }
      setLogs(prev => [newLog, ...prev].slice(0, 100))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status) => {
    if (status >= 200 && status < 300) return 'success'
    if (status >= 300 && status < 400) return 'info'
    if (status >= 400 && status < 500) return 'warning'
    return 'error'
  }

  const filteredLogs = logs.filter(log =>
    log.path.toLowerCase().includes(filter.toLowerCase()) ||
    log.method.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <MainLayout user={user}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Request Logs</h1>
        <p className="text-white/60">Real-time API request monitoring and filtering</p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-lg p-6 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-3 text-cyan-400" />
            <input
              type="text"
              placeholder="Filter by path or method..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:border-cyan-500/50 outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="secondary" size="sm">
            <Trash2 size={16} className="mr-2" />
            Clear
          </Button>
        </div>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-white/70">Timestamp</th>
                <th className="px-6 py-3 text-left text-white/70">Method</th>
                <th className="px-6 py-3 text-left text-white/70">Path</th>
                <th className="px-6 py-3 text-left text-white/70">Status</th>
                <th className="px-6 py-3 text-left text-white/70">Response Time</th>
                <th className="px-6 py-3 text-left text-white/70">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white/60 text-xs flex items-center gap-2">
                    <Clock size={14} />
                    {formatTime(log.timestamp)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="info">
                      {log.method}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-white/80 font-mono text-xs">{log.path}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusBadge(log.status)}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-white/80">{log.responseTime}ms</td>
                  <td className="px-6 py-4 text-white/60 font-mono text-xs">{log.ip}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
      >
        <Card>
          <p className="text-white/60 text-sm mb-1">Total Logs</p>
          <p className="text-2xl font-bold text-cyan-400">{filteredLogs.length}</p>
        </Card>
        <Card>
          <p className="text-white/60 text-sm mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-green-400">
            {Math.round((filteredLogs.filter(l => l.status < 400).length / filteredLogs.length) * 100)}%
          </p>
        </Card>
        <Card>
          <p className="text-white/60 text-sm mb-1">Avg Response</p>
          <p className="text-2xl font-bold text-purple-400">
            {Math.round(filteredLogs.reduce((a, b) => a + b.responseTime, 0) / filteredLogs.length)}ms
          </p>
        </Card>
        <Card>
          <p className="text-white/60 text-sm mb-1">Errors</p>
          <p className="text-2xl font-bold text-red-400">
            {filteredLogs.filter(l => l.status >= 400).length}
          </p>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default LogsPage
