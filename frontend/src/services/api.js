import axios from 'axios'
const API_BASE_URL = 'http://localhost:3000/api/v1'
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  register: (data) => 
    apiClient.post('/auth/register', data),
  refreshToken: () => 
    apiClient.post('/auth/refresh-token'),
  logout: () => 
    apiClient.post('/auth/logout'),
  getMe: () => 
    apiClient.get('/auth/me'),
}

export const userAPI = {
  getAll: (page = 1, limit = 10) => 
    apiClient.get(`/users?page=${page}&limit=${limit}`),
  getById: (id) => 
    apiClient.get(`/users/${id}`),
  create: (data) => 
    apiClient.post('/users', data),
  update: (id, data) => 
    apiClient.put(`/users/${id}`, data),
  delete: (id) => 
    apiClient.delete(`/users/${id}`),
}

export const orderAPI = {
  getAll: (page = 1, limit = 10) => 
    apiClient.get(`/orders?page=${page}&limit=${limit}`),
  getById: (id) => 
    apiClient.get(`/orders/${id}`),
  create: (data) => 
    apiClient.post('/orders', data),
  update: (id, data) => 
    apiClient.put(`/orders/${id}`, data),
  cancel: (id) => 
    apiClient.post(`/orders/${id}/cancel`),
}

export const paymentAPI = {
  process: (data) => 
    apiClient.post('/payments/process', data),
  getTransaction: (id) => 
    apiClient.get(`/payments/${id}`),
  refund: (transactionId, data) => 
    apiClient.post(`/payments/refund`, { transactionId, ...data }),
}

export const metricsAPI = {
  getMetrics: () => 
    apiClient.get('/metrics'),
  getHealthCheck: () => 
    apiClient.get('/health'),
  getCacheStats: () => 
    apiClient.get('/cache/stats'),
  getCacheKeys: () => 
    apiClient.get('/cache/keys'),
  clearCache: () => 
    apiClient.post('/cache/clear'),
  getRateLimitStats: () => 
    apiClient.get('/rate-limit/stats'),
}

export default apiClient
