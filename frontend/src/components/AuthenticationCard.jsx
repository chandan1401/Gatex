import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import SSOButtons from './SSOButtons'
import DemoCredentials from './DemoCredentials'

const AuthenticationCard = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    if (email && !email.includes('@')) newErrors.email = 'Invalid email address'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onLogin(email, password)
    }
  }

  const handleSelectCredential = (selectedEmail, selectedPassword) => {
    setEmail(selectedEmail)
    setPassword(selectedPassword)
    setShowPassword(false)
    setErrors({})
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      {/* Glass Card Container */}
      <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
        {/* Content */}
        <div className="relative p-8 space-y-8">
          {/* Header */}
          <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">GateX</h1>
            </div>
            <p className="text-sm text-gray-400">Enterprise API Gateway Platform</p>
            <p className="text-xs text-gray-500">Sign in to your account to continue</p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} custom={1} variants={itemVariants} initial="hidden" animate="visible" className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 text-white placeholder-gray-500 transition-all ${
                    errors.email ? 'border-red-500/50' : ''
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 text-white placeholder-gray-500 transition-all ${
                    errors.password ? 'border-red-500/50' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 cursor-pointer accent-indigo-500"
              />
              <label htmlFor="remember" className="text-xs text-gray-400 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Sign In Button */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"></motion.div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white/[0.03] text-gray-500">or continue with</span>
            </div>
          </motion.div>

          {/* SSO Buttons */}
          <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
            <SSOButtons />
          </motion.div>

          {/* Footer */}
          <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible" className="space-y-2 text-center">
            <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot password?
            </a>
            <div className="text-xs text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Contact sales
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Demo Credentials Panel */}
      <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible">
        <DemoCredentials onSelectCredential={handleSelectCredential} />
      </motion.div>

      {/* Bottom Security Info */}
      <motion.div custom={7} variants={itemVariants} initial="hidden" animate="visible" className="mt-6 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 8l3.293 3.293a1 1 0 11-1.414 1.414l-4-4z" clipRule="evenodd" />
          </svg>
          Enterprise SSO & 2FA enabled
        </p>
      </motion.div>
    </motion.div>
  )
}

export default AuthenticationCard

