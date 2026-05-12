import { useRef, useEffect, useCallback } from 'react'

export const useClickOutside = (callback) => {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [callback])

  return ref
}

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue((v) => !v), [])
  return [value, toggle, setValue]
}

export const useArray = (initialValue = []) => {
  const [value, setValue] = useState(initialValue)

  return {
    value,
    push: useCallback((element) => {
      setValue((v) => [...v, element])
    }, []),
    filter: useCallback((callback) => {
      setValue((v) => v.filter(callback))
    }, []),
    update: useCallback((index, newElement) => {
      setValue((v) => [...v.slice(0, index), newElement, ...v.slice(index + 1)])
    }, []),
    remove: useCallback((index) => {
      setValue((v) => [...v.slice(0, index), ...v.slice(index + 1)])
    }, []),
    clear: useCallback(() => {
      setValue([])
    }, []),
  }
}

export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue)

  return {
    count,
    increment: useCallback(() => setCount((c) => c + 1), []),
    decrement: useCallback(() => setCount((c) => c - 1), []),
    reset: useCallback(() => setCount(initialValue), [initialValue]),
  }
}
