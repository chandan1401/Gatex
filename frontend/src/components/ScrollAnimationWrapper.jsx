import React from 'react'
import { motion } from 'framer-motion'
import { useScrollIntoView, getScrollTransform } from '../hooks/useScrollAnimation'

export const ScrollAnimationWrapper = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  threshold = 0.2,
  className = '',
}) => {
  const { ref, isInView } = useScrollIntoView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration, delay: delay / 1000 }}
      className={className}
      style={{
        transform: isInView ? 'none' : getScrollTransform(direction, false),
        transitionProperty: 'transform, opacity',
        transitionDuration: `${duration}s`,
        transitionDelay: isInView ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollAnimationWrapper
