import io from 'socket.io-client'

let socket = null

export const initializeSocket = (token) => {
  if (socket) return socket

  socket = io('http://localhost:3000', {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id)
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Event listeners
export const onMetricsUpdate = (callback) => {
  if (socket) {
    socket.on('metrics:update', callback)
  }
}

export const onLogUpdate = (callback) => {
  if (socket) {
    socket.on('log:new', callback)
  }
}

export const onTrafficUpdate = (callback) => {
  if (socket) {
    socket.on('traffic:update', callback)
  }
}

export const onServiceStatusChange = (callback) => {
  if (socket) {
    socket.on('service:status', callback)
  }
}

export const onRateLimitAlert = (callback) => {
  if (socket) {
    socket.on('ratelimit:alert', callback)
  }
}

export const onRedisAlert = (callback) => {
  if (socket) {
    socket.on('redis:alert', callback)
  }
}

export const onKafkaEvent = (callback) => {
  if (socket) {
    socket.on('kafka:event', callback)
  }
}

export const offMetricsUpdate = () => {
  if (socket) {
    socket.off('metrics:update')
  }
}

export const offLogUpdate = () => {
  if (socket) {
    socket.off('log:new')
  }
}

export const offTrafficUpdate = () => {
  if (socket) {
    socket.off('traffic:update')
  }
}

export const emitEvent = (eventName, data) => {
  if (socket) {
    socket.emit(eventName, data)
  }
}

export default socket
