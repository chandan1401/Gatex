import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Bell, User, LogOut, Settings, Home } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const TopBar = ({ onMenuClick, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    navigate('/login')
  }

  return (
    <div className="sticky top-0 z-20 glass border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="lg:hidden text-white/70 hover:text-white"
        >
          <Menu size={24} />
        </motion.button>

        <div className="flex-1 hidden lg:block" />

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative text-white/70 hover:text-white transition-colors"
          >
            <Bell size={22} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </motion.button>

          {/* User Menu with Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg glass-light cursor-pointer hover:bg-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-white/50">{user?.email || 'admin@gatex.com'}</p>
              </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 glass-light rounded-lg border border-white/10 shadow-xl overflow-hidden z-50"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-white/50">{user?.email || 'admin@gatex.com'}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/dashboard')
                        setIsDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Home size={18} />
                      <span className="text-sm">Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('/settings')
                        setIsDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Settings size={18} />
                      <span className="text-sm">Settings</span>
                    </button>

                    <div className="border-t border-white/10 my-2" />

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close dropdown when clicking outside */}
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDropdownOpen(false)}
                className="fixed inset-0 z-40"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
