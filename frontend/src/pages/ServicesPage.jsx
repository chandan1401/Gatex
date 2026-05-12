import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Zap } from 'lucide-react'
import MainLayout from '../components/Layout'
import { Card, Badge, StatCard } from '../components/CommonComponents'

const ServicesPage = ({ user }) => {
  const [services] = useState([
    {
      name: 'Auth Service',
      url: 'http://localhost:3001',
      status: 'healthy',
      uptime: 99.99,
      responseTime: 45,
      requests: '1.2k/h',
      instances: 3,
      cpu: '32%',
      memory: '48%',
    },
    {
      name: 'User Service',
      url: 'http://localhost:3002',
      status: 'healthy',
      uptime: 99.95,
      responseTime: 78,
      requests: '890/h',
      instances: 2,
      cpu: '28%',
      memory: '42%',
    },
    {
      name: 'Order Service',
      url: 'http://localhost:3003',
      status: 'healthy',
      uptime: 99.98,
      responseTime: 120,
      requests: '2.3k/h',
      instances: 3,
      cpu: '45%',
      memory: '61%',
    },
    {
      name: 'Payment Service',
      url: 'http://localhost:3004',
      status: 'degraded',
      uptime: 99.70,
      responseTime: 256,
      requests: '450/h',
      instances: 2,
      cpu: '58%',
      memory: '72%',
    },
  ])

  const [dependencies] = useState([
    { from: 'Gateway', to: 'Auth Service', status: 'connected', latency: '12ms' },
    { from: 'Gateway', to: 'User Service', status: 'connected', latency: '18ms' },
    { from: 'Gateway', to: 'Order Service', status: 'connected', latency: '25ms' },
    { from: 'Gateway', to: 'Payment Service', status: 'degraded', latency: '152ms' },
    { from: 'Order Service', to: 'Payment Service', status: 'connected', latency: '35ms' },
  ])

  const getStatusIcon = (status) => {
    return status === 'healthy' ? (
      <CheckCircle size={20} className="text-green-400" />
    ) : (
      <AlertCircle size={20} className="text-yellow-400" />
    )
  }

  return (
    <MainLayout user={user}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Service Discovery</h1>
        <p className="text-white/60">Monitor microservices health and dependencies</p>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        {services.map((service, idx) => (
          <motion.div
            key={service.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                  <p className="text-white/50 text-xs font-mono mt-1">{service.url}</p>
                </div>
                {getStatusIcon(service.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-white/50 text-xs">Uptime</p>
                  <p className="text-green-400 font-semibold">{service.uptime}%</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs">Response Time</p>
                  <p className="text-cyan-400 font-semibold">{service.responseTime}ms</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs">Instances</p>
                  <p className="text-purple-400 font-semibold">{service.instances}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs">Requests/h</p>
                  <p className="text-orange-400 font-semibold">{service.requests}</p>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>CPU</span>
                    <span>{service.cpu}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: service.cpu }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Memory</span>
                    <span>{service.memory}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: service.memory }}
                      transition={{ duration: 1, delay: idx * 0.1 + 0.2 }}
                      className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Dependencies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Service Dependencies</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white/70">From</th>
                  <th className="px-4 py-3 text-left text-white/70">To</th>
                  <th className="px-4 py-3 text-left text-white/70">Status</th>
                  <th className="px-4 py-3 text-left text-white/70">Latency</th>
                </tr>
              </thead>
              <tbody>
                {dependencies.map((dep, idx) => (
                  <motion.tr
                    key={`${dep.from}-${dep.to}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-4 py-4 text-white/80">{dep.from}</td>
                    <td className="px-4 py-4 text-white/80 flex items-center gap-2">
                      <Zap size={16} className="text-cyan-400" />
                      {dep.to}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={dep.status === 'connected' ? 'success' : 'warning'}>
                        {dep.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-white/60 font-mono">{dep.latency}</td>
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

export default ServicesPage
