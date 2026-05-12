import { useEffect, useRef, useState } from 'react'

// Hook for detecting if element is in view
export const useScrollIntoView = () => {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          // Stop observing after first intersection
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isInView }
}

// Get transform based on direction
export const getScrollTransform = (direction, isInView) => {
  if (isInView) return 'none'

  switch (direction) {
    case 'down':
      return 'translateY(-40px)'
    case 'left':
      return 'translateX(-40px)'
    case 'right':
      return 'translateX(40px)'
    case 'scale':
      return 'scale(0.8)'
    case 'up':
    default:
      return 'translateY(40px)'
  }
}

