export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString()
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const formatPercentage = (value, total) => {
  return ((value / total) * 100).toFixed(2)
}

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'success':
    case 'healthy':
    case 'active':
      return 'text-green-400'
    case 'warning':
    case 'degraded':
      return 'text-yellow-400'
    case 'error':
    case 'unhealthy':
    case 'down':
      return 'text-red-400'
    case 'pending':
      return 'text-blue-400'
    default:
      return 'text-gray-400'
  }
}

export const getStatusBg = (status) => {
  switch (status?.toLowerCase()) {
    case 'success':
    case 'healthy':
    case 'active':
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    case 'warning':
    case 'degraded':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    case 'error':
    case 'unhealthy':
    case 'down':
      return 'bg-red-500/20 text-red-300 border-red-500/30'
    case 'pending':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }
}

export const getMethodColor = (method) => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'text-blue-400'
    case 'POST':
      return 'text-green-400'
    case 'PUT':
      return 'text-yellow-400'
    case 'DELETE':
      return 'text-red-400'
    case 'PATCH':
      return 'text-purple-400'
    default:
      return 'text-gray-400'
  }
}

export const getStatusCodeColor = (code) => {
  if (code >= 200 && code < 300) return 'text-green-400'
  if (code >= 300 && code < 400) return 'text-blue-400'
  if (code >= 400 && code < 500) return 'text-yellow-400'
  if (code >= 500) return 'text-red-400'
  return 'text-gray-400'
}

export const truncateString = (str, length) => {
  return str?.length > length ? str.substring(0, length) + '...' : str
}

export const generateChartColors = () => {
  return [
    '#0ea5e9', // cyan
    '#d946ef', // purple
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f59e0b', // amber
  ]
}
