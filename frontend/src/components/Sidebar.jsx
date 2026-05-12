import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  Archive,
  Database,
  Activity,
  Zap,
  MessageSquare,
  Container,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const { logout } = useAuth()
  const [expandedMenu, setExpandedMenu] = useState(null)

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      submenu: null,
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      submenu: null,
    },
    {
      title: 'Logs',
      icon: Archive,
      path: '/logs',
      submenu: null,
    },
    {
      title: 'Cache & Performance',
      icon: Database,
      path: '/redis',
      submenu: null,
    },
    {
      title: 'Traffic Monitor',
      icon: Activity,
      path: '/traffic',
      submenu: null,
    },
    {
      title: 'Rate Limiting',
      icon: Zap,
      path: '/rate-limiter',
      submenu: null,
    },
    {
      title: 'WebSocket',
      icon: MessageSquare,
      path: '/websocket',
      submenu: null,
    },
    {
      title: 'Kubernetes',
      icon: Container,
      path: '/kubernetes',
      submenu: null,
    },
    {
      title: 'Kafka Events',
      icon: FileText,
      path: '/kafka',
      submenu: null,
    },
    {
      title: 'Services',
      icon: Zap,
      path: '/services',
      submenu: null,
    },
    {
      title: 'API Testing',
      icon: MessageSquare,
      path: '/api-testing',
      submenu: null,
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      submenu: null,
    },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-72 glass-darker z-40 border-r border-white/10 overflow-y-auto lg:translate-x-0"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gradient">GateX</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-cyan-500/30 to-purple-600/30 text-cyan-300 border border-cyan-500/50'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.title}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-6 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-r"
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
