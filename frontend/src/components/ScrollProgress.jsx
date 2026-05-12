import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 z-50"
        style={{ scaleX: scrollProgress / 100, transformOrigin: 'left' }}
        initial={{ scaleX: 0 }}
      />

      {/* Scroll Indicator (Shows position) */}
      {scrollProgress > 5 && (
        <motion.div
          className="fixed top-6 right-6 z-40 text-xs font-semibold text-white/70 backdrop-blur-md bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {Math.round(scrollProgress)}%
        </motion.div>
      )}
    </>
  )
}

export default ScrollProgress
