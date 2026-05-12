import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export const Card = ({ children, className, hover = true, ...props }) => (
  <motion.div
    whileHover={hover ? { y: -2 } : {}}
    className={clsx(
      'glass rounded-lg p-6 transition-all duration-300',
      hover && 'cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
)

export const StatCard = ({ icon: Icon, label, value, unit, trend, color = 'cyan' }) => {
  const colors = {
    cyan: 'from-cyan-500/20 to-blue-500/20',
    purple: 'from-purple-500/20 to-pink-500/20',
    green: 'from-green-500/20 to-emerald-500/20',
    orange: 'from-orange-500/20 to-red-500/20',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass rounded-lg p-6 border border-white/10 hover:border-${color}-500/30 transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[color]} group-hover:scale-110 transition-transform`}>
          <Icon size={24} className={`text-${color}-400`} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            trend > 0 
              ? 'bg-green-500/20 text-green-300' 
              : 'bg-red-500/20 text-red-300'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-white/60 text-sm font-medium mb-2">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value}
        <span className="text-sm text-white/50 ml-1">{unit}</span>
      </p>
    </motion.div>
  )
}

export const Badge = ({ children, variant = 'info', size = 'md', className }) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  ...props
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg transition-all',
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      className={clsx(
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full"
  />
)

export const LoadingSkeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`glass rounded-lg ${className}`}
        />
      ))}
    </>
  )
}
