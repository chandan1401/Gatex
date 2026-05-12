import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Copy, Check } from 'lucide-react'

const DemoCredentials = ({ onSelectCredential }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const demoCredentials = [
    {
      email: 'admin@gatex.com',
      password: 'admin123',
      role: 'Admin',
      roleColor: 'from-red-500 to-pink-600',
      description: 'Full admin access to all features',
    },
    {
      email: 'demo@gatex.com',
      password: 'demo123',
      role: 'Demo User',
      roleColor: 'from-blue-500 to-cyan-600',
      description: 'Standard user access',
    },
    {
      email: 'test@example.com',
      password: 'password123',
      role: 'Test User',
      roleColor: 'from-purple-500 to-indigo-600',
      description: 'Testing account',
    },
  ]

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleSelectCredential = (email, password) => {
    if (onSelectCredential) {
      onSelectCredential(email, password)
    }
  }

  return (
    <div className="mt-6 px-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.05] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/70 group-hover:text-white">
            Demo Credentials
          </span>
          <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
            {demoCredentials.length}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={18} className="text-white/50 group-hover:text-white/70" />
        </motion.div>
      </motion.button>

      {/* Expanded Credentials List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-2 space-y-2"
          >
            {demoCredentials.map((cred, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all"
              >
                {/* Role Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${cred.roleColor} text-white`}>
                    {cred.role}
                  </span>
                  <button
                    onClick={() => handleSelectCredential(cred.email, cred.password)}
                    className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 rounded border border-cyan-500/50 transition-all"
                  >
                    Use This
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-white/50 mb-2">{cred.description}</p>

                {/* Email */}
                <div className="mb-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider">Email</label>
                  <div className="flex items-center justify-between mt-1 px-2 py-1.5 bg-white/[0.02] rounded border border-white/5">
                    <code className="text-xs text-cyan-300 font-mono break-all">{cred.email}</code>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCopy(cred.email, `email-${index}`)}
                      className="ml-2 p-1 text-white/50 hover:text-white/70 transition-colors"
                    >
                      {copiedIndex === `email-${index}` ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider">Password</label>
                  <div className="flex items-center justify-between mt-1 px-2 py-1.5 bg-white/[0.02] rounded border border-white/5">
                    <code className="text-xs text-purple-300 font-mono">{cred.password}</code>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCopy(cred.password, `password-${index}`)}
                      className="ml-2 p-1 text-white/50 hover:text-white/70 transition-colors"
                    >
                      {copiedIndex === `password-${index}` ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Text */}
      <p className="mt-3 text-xs text-white/40 text-center">
        💡 Click "Use This" to auto-fill the login form
      </p>
    </div>
  )
}

export default DemoCredentials
