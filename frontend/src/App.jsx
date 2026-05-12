import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import NotificationCenter from './components/NotificationCenter'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import EnterpriseLoginPage from './pages/EnterpriseLoginPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import LogsPage from './pages/LogsPage'
import APITestingPage from './pages/APITestingPage'
import RedisPage from './pages/RedisPage'
import TrafficMonitorPage from './pages/TrafficPage'
import RateLimiterPage from './pages/RateLimiterPage'
import KubernetesPage from './pages/KubernetesPage'
import KafkaPage from './pages/KafkaPage'
import WebSocketPage from './pages/WebSocketPage'
import ServicesPage from './pages/ServicesPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'

import './index.css'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <NotificationCenter />
          <Routes>
            <Route path="/login" element={<EnterpriseLoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/logs" element={<ProtectedRoute><LogsPage /></ProtectedRoute>} />
            <Route path="/api-testing" element={<ProtectedRoute><APITestingPage /></ProtectedRoute>} />
            <Route path="/redis" element={<ProtectedRoute><RedisPage /></ProtectedRoute>} />
            <Route path="/traffic" element={<ProtectedRoute><TrafficMonitorPage /></ProtectedRoute>} />
            <Route path="/rate-limiter" element={<ProtectedRoute><RateLimiterPage /></ProtectedRoute>} />
            <Route path="/kubernetes" element={<ProtectedRoute><KubernetesPage /></ProtectedRoute>} />
            <Route path="/kafka" element={<ProtectedRoute><KafkaPage /></ProtectedRoute>} />
            <Route path="/websocket" element={<ProtectedRoute><WebSocketPage /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/" element={<EnterpriseLoginPage />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  )
}
