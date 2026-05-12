import React from 'react'
import { motion } from 'framer-motion'

const StatusIndicator = ({ status = 'online' }) => {
  const statusConfig = {
    online: { color: 'bg-green-500', label: 'Online', pulse: true },
    offline: { color: 'bg-red-500', label: 'Offline', pulse: false },
    maintenance: { color: 'bg-amber-500', label: 'Maintenance', pulse: true },
  }

  const config = statusConfig[status] || statusConfig.online

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={config.pulse ? { scale: [1, 1.2, 1] } : {}}
        transition={config.pulse ? { duration: 2, repeat: Infinity } : {}}
        className={`w-2 h-2 rounded-full ${config.color}`}
      >
        {config.pulse && <div className={`absolute w-2 h-2 rounded-full ${config.color} animate-ping`}></div>}
      </motion.div>
    </div>
  )
}

export default StatusIndicator
