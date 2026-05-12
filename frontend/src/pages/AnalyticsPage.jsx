import React, { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '../components/Layout'
import { Card, Button } from '../components/CommonComponents'
import { BarChart3, Settings as SettingsIcon, Bell, Lock, Palette } from 'lucide-react'

const AnalyticsPage = ({ user }) => {
  const [timeRange, setTimeRange] = useState('24h')

  const analytics = [
    {
      title: 'API Traffic Analysis',
      description: 'Detailed breakdown of API usage patterns and trends',
      metrics: {
        'Total Requests': '1.2M',
        'Avg RPS': '4,200',
        'Peak RPS': '8,900',
        'Success Rate': '98.2%',
      },
    },
    {
      title: 'Performance Metrics',
      description: 'Response time and latency analysis',
      metrics: {
        'P50 Latency': '45ms',
        'P95 Latency': '125ms',
        'P99 Latency': '250ms',
        'Max Latency': '980ms',
      },
    },
    {
      title: 'Error Analysis',
      description: 'Error rate and failure patterns',
      metrics: {
        'Total Errors': '21.8k',
        'Error Rate': '1.8%',
        '4xx Errors': '18.2k',
        '5xx Errors': '3.6k',
      },
    },
  ]

  return (
    <MainLayout user={user}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Analytics</h1>
        <p className="text-white/60">Comprehensive analytics and insights</p>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-8"
      >
        {['1h', '24h', '7d', '30d'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'primary' : 'secondary'}
            onClick={() => setTimeRange(range)}
            size="sm"
          >
            {range}
          </Button>
        ))}
      </motion.div>

      {/* Analytics Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {analytics.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-white mb-1">{section.title}</h3>
              <p className="text-white/50 text-sm mb-4">{section.description}</p>
              <div className="space-y-3">
                {Object.entries(section.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                    <span className="text-white/70 text-sm">{key}</span>
                    <span className="text-cyan-400 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </MainLayout>
  )
}

export default AnalyticsPage
