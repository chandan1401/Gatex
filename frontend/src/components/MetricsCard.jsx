import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const MetricsCard = ({ icon: Icon, label, value, change, positive }) => {
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.2)' }}
      className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-lg font-bold text-white">{value}</p>
        </div>
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500/20 to-purple-600/20 group-hover:from-indigo-500/40 group-hover:to-purple-600/40 flex items-center justify-center transition-all">
          <Icon className="w-4 h-4 text-indigo-400" />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2">
        {positive ? <TrendingUp className="w-3 h-3 text-green-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
        <span className={`text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
      </div>
    </motion.div>
  )
}

export default MetricsCard
