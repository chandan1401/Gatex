import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, TrendingUp, AlertCircle } from 'lucide-react'
import MainLayout from '../components/Layout'
import { StatCard, Card, Badge } from '../components/CommonComponents'
import { TrafficLineChart } from '../components/Charts'

const KafkaPage = ({ user }) => {
  const [kafkaMetrics] = useState({
    totalTopics: 12,
    activeProducers: 24,
    activeConsumers: 45,
    lagSum: 1250,
  })

  const [topics] = useState([
    {
      name: 'api-requests',
      partitions: 3,
      producers: 5,
      consumers: 8,
      lag: 0,
      throughput: '4.2k msg/s',
    },
    {
      name: 'user-events',
      partitions: 2,
      producers: 3,
      consumers: 6,
      lag: 125,
      throughput: '1.8k msg/s',
    },
    {
      name: 'order-events',
      partitions: 4,
      producers: 4,
      consumers: 7,
      lag: 890,
      throughput: '2.5k msg/s',
    },
    {
      name: 'payment-events',
      partitions: 2,
      producers: 2,
      consumers: 4,
      lag: 235,
      throughput: '0.9k msg/s',
    },
  ])

  const [throughputData] = useState(
    Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      requests: Math.floor(Math.random() * 5000) + 1000,
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
        <h1 className="text-4xl font-bold text-gradient mb-2">Kafka Event Streaming</h1>
        <p className="text-white/60">Monitor topics, producers, and consumers</p>
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
            icon={MessageSquare}
            label="Total Topics"
            value={kafkaMetrics.totalTopics}
            color="cyan"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <StatCard
            icon={TrendingUp}
            label="Active Producers"
            value={kafkaMetrics.activeProducers}
            color="green"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <StatCard
            icon={TrendingUp}
            label="Active Consumers"
            value={kafkaMetrics.activeConsumers}
            color="purple"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <StatCard
            icon={AlertCircle}
            label="Total Consumer Lag"
            value={kafkaMetrics.lagSum}
            unit="msgs"
            color="orange"
          />
        </motion.div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Message Throughput (24h)</h3>
          <TrafficLineChart data={throughputData} />
        </Card>
      </motion.div>

      {/* Topics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Kafka Topics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white/70">Topic Name</th>
                  <th className="px-4 py-3 text-left text-white/70">Partitions</th>
                  <th className="px-4 py-3 text-left text-white/70">Producers</th>
                  <th className="px-4 py-3 text-left text-white/70">Consumers</th>
                  <th className="px-4 py-3 text-left text-white/70">Consumer Lag</th>
                  <th className="px-4 py-3 text-left text-white/70">Throughput</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic, idx) => (
                  <motion.tr
                    key={topic.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-4 py-4 text-white/80 font-mono">{topic.name}</td>
                    <td className="px-4 py-4 text-white/60">{topic.partitions}</td>
                    <td className="px-4 py-4 text-white/60">{topic.producers}</td>
                    <td className="px-4 py-4 text-white/60">{topic.consumers}</td>
                    <td className="px-4 py-4">
                      <Badge variant={topic.lag > 500 ? 'warning' : topic.lag > 0 ? 'info' : 'success'}>
                        {topic.lag}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-cyan-400 font-semibold">{topic.throughput}</td>
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

export default KafkaPage
