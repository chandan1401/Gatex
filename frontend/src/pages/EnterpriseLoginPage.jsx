import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import InfrastructurePanel from '../components/InfrastructurePanel'
import AuthenticationCard from '../components/AuthenticationCard'
import ScrollProgress from '../components/ScrollProgress'
import ScrollToTop from '../components/ScrollToTop'

export default function EnterpriseLoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (email, password) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(email, password)
      const data = response.data

      if (data.success && data.data && data.data.tokens) {
        login(data.data.user, data.data.tokens.accessToken)
        navigate('/dashboard')
      } else {
        console.error('Login failed:', data.message)
      }
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0F172A] to-[#240046] overflow-hidden flex flex-col">
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Animated Background Mesh Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex">
        {/* Left Infrastructure Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hidden lg:flex lg:w-1/2 p-8 flex-col justify-between"
        >
          <InfrastructurePanel />
        </motion.div>

        {/* Right Authentication Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full lg:w-1/2 flex flex-col justify-start items-center p-4 lg:p-8 overflow-y-auto"
        >
          <div className="w-full max-w-md py-6 lg:py-8">
            <AuthenticationCard onLogin={handleLogin} isLoading={isLoading} />
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}
