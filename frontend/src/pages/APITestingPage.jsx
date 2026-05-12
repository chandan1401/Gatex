import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Copy, Play, Trash2, SaveIcon } from 'lucide-react'
import MainLayout from '../components/Layout'
import { Card, Badge, Button, LoadingSpinner } from '../components/CommonComponents'
import { useNotification } from '../context/NotificationContext'

const APITestingPage = ({ user }) => {
  const [requests, setRequests] = useState([
    { id: 1, name: 'Get Users', method: 'GET', url: '/api/users', headers: 'Authorization: Bearer token' },
    { id: 2, name: 'Create Order', method: 'POST', url: '/api/orders', body: '{"userId": 1, "total": 100}' },
  ])

  const [selectedRequest, setSelectedRequest] = useState(null)
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('http://localhost:3000/api/users')
  const [body, setBody] = useState('')
  const [headers, setHeaders] = useState('Authorization: Bearer token')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [responseTime, setResponseTime] = useState(0)

  const { success, error, info } = useNotification()

  const handleSendRequest = async () => {
    setLoading(true)
    const startTime = Date.now()

    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(
            headers.split('\n').map(h => {
              const [key, value] = h.split(':')
              return [key.trim(), value?.trim() || '']
            })
          ),
        },
      }

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = body
      }

      const res = await fetch(url, config)
      const data = await res.json()

      setResponseTime(Date.now() - startTime)
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
        headers: Object.fromEntries(res.headers),
      })

      success('Request sent successfully!')
    } catch (err) {
      error(err.message || 'Failed to send request')
      setResponse({
        error: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    success('Copied to clipboard!')
  }

  return (
    <MainLayout user={user}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">API Testing Console</h1>
        <p className="text-white/60">Test API endpoints in real-time</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Builder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Method & URL */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Request</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 outline-none w-24"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                  <option>PATCH</option>
                </select>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="http://localhost:3000/api/..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-cyan-500/50 outline-none"
                />
              </div>

              {/* Headers */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Headers</label>
                <textarea
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  placeholder="Authorization: Bearer token"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-cyan-500/50 outline-none h-20 font-mono text-sm"
                />
              </div>

              {/* Body */}
              {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Body</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{"key": "value"}'
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-cyan-500/50 outline-none h-32 font-mono text-sm"
                  />
                </div>
              )}

              {/* Send Button */}
              <Button
                onClick={handleSendRequest}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <LoadingSpinner /> Sending...
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Response */}
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Response</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant={response.status >= 200 && response.status < 300 ? 'success' : 'error'}>
                        {response.status} {response.statusText}
                      </Badge>
                    </div>
                    <span className="text-white/60 text-sm">{responseTime}ms</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <pre className="text-white/80 font-mono text-sm overflow-auto max-h-64">
                      {JSON.stringify(response.data || response.error, null, 2)}
                    </pre>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(response.data, null, 2))}
                    className="w-full"
                  >
                    <Copy size={16} className="mr-2" />
                    Copy Response
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Saved Requests */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Saved Requests</h3>
            <div className="space-y-2">
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setMethod(req.method)
                    setUrl(req.url)
                    if (req.headers) setHeaders(req.headers)
                    if (req.body) setBody(req.body)
                  }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{req.name}</p>
                      <Badge variant="info" size="sm" className="mt-1">{req.method}</Badge>
                    </div>
                    <button className="text-white/40 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default APITestingPage
