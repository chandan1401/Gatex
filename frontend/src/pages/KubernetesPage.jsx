import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Boxes, Cpu, HardDrive, AlertCircle } from 'lucide-react'
import MainLayout from '../components/Layout'
import { StatCard, Card, Badge } from '../components/CommonComponents'
import { CPUMemoryChart } from '../components/Charts'

const KubernetesPage = ({ user }) => {
  const [pods] = useState([
    {
      name: 'api-gateway-0',
      status: 'Running',
      ready: '1/1',
      restarts: 0,
      cpu: '45%',
      memory: '62%',
      node: 'node-1',
    },
    {
      name: 'api-gateway-1',
      status: 'Running',
      ready: '1/1',
      restarts: 0,
      cpu: '38%',
      memory: '58%',
      node: 'node-2',
    },
    {
      name: 'api-gateway-2',
      status: 'Running',
      ready: '1/1',
      restarts: 2,
      cpu: '52%',
      memory: '71%',
      node: 'node-3',
    },
    {
      name: 'redis-0',
      status: 'Running',
      ready: '1/1',
      restarts: 0,
      cpu: '12%',
      memory: '28%',
      node: 'node-1',
    },
    {
      name: 'mongodb-0',
      status: 'Running',
      ready: '1/1',
      restarts: 0,
      cpu: '35%',
      memory: '85%',
      node: 'node-2',
    },
  ])

  const [nodes] = useState([
    { name: 'node-1', status: 'Ready', pods: 3, cpu: '45%', memory: '62%', disk: '38%' },
    { name: 'node-2', status: 'Ready', pods: 3, cpu: '42%', memory: '68%', disk: '42%' },
    { name: 'node-3', status: 'Ready', pods: 2, cpu: '38%', memory: '55%', disk: '35%' },
  ])

  const [resourceData] = useState(
    Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
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
        <h1 className="text-4xl font-bold text-gradient mb-2">Kubernetes Cluster</h1>
        <p className="text-white/60">Monitor container orchestration and cluster health</p>
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
            icon={Boxes}
            label="Total Pods"
            value={pods.length}
            color="cyan"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <StatCard
            icon={Boxes}
            label="Running Pods"
            value={pods.filter(p => p.status === 'Running').length}
            color="green"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <StatCard
            icon={AlertCircle}
            label="Pod Restarts"
            value={pods.reduce((sum, p) => sum + p.restarts, 0)}
            color="orange"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <StatCard
            icon={Boxes}
            label="Healthy Nodes"
            value={`${nodes.filter(n => n.status === 'Ready').length}/${nodes.length}`}
            color="purple"
          />
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Cluster Resource Usage</h3>
          <CPUMemoryChart data={resourceData} />
        </Card>
      </motion.div>

      {/* Pods & Nodes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Pods */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Running Pods</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-3 py-2 text-left text-white/70">Pod Name</th>
                  <th className="px-3 py-2 text-left text-white/70">Status</th>
                  <th className="px-3 py-2 text-left text-white/70">CPU</th>
                  <th className="px-3 py-2 text-left text-white/70">Memory</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {pods.map((pod, idx) => (
                  <motion.tr
                    key={pod.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-3 py-2 text-white/80 font-mono">{pod.name}</td>
                    <td className="px-3 py-2">
                      <Badge variant="success">{pod.status}</Badge>
                    </td>
                    <td className="px-3 py-2 text-white/60">{pod.cpu}</td>
                    <td className="px-3 py-2 text-white/60">{pod.memory}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Nodes */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Cluster Nodes</h3>
          <div className="space-y-3">
            {nodes.map((node, idx) => (
              <motion.div
                key={node.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium font-mono text-sm">{node.name}</span>
                  <Badge variant="success">{node.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-white/50">CPU</p>
                    <p className="text-cyan-400 font-semibold">{node.cpu}</p>
                  </div>
                  <div>
                    <p className="text-white/50">Memory</p>
                    <p className="text-purple-400 font-semibold">{node.memory}</p>
                  </div>
                  <div>
                    <p className="text-white/50">Disk</p>
                    <p className="text-orange-400 font-semibold">{node.disk}</p>
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

export default KubernetesPage
