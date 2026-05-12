import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useNotification } from '../context/NotificationContext'

export default function NotificationCenter() {
  const { notifications, removeNotification } = useNotification()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-400" />
      default:
        return <Info size={20} className="text-blue-400" />
    }
  }

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30'
      case 'error':
        return 'bg-red-500/10 border-red-500/30'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30'
      default:
        return 'bg-blue-500/10 border-blue-500/30'
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`glass rounded-lg p-4 mb-3 flex items-start gap-3 max-w-sm pointer-events-auto border ${getBgColor(notification.type)}`}
          >
            {getIcon(notification.type)}
            <p className="flex-1 text-sm text-white">{notification.message}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeNotification(notification.id)}
              className="text-white/50 hover:text-white"
            >
              <X size={18} />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
