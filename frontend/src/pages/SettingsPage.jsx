import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react'
import MainLayout from '../components/Layout'
import { Card, Button } from '../components/CommonComponents'
import { useNotification } from '../context/NotificationContext'

const SettingsPage = ({ user }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    emailAlerts: true,
    autoRefresh: true,
    refreshInterval: 5000,
    theme_color: 'cyan',
  })

  const { success } = useNotification()

  const handleSave = () => {
    success('Settings saved successfully!')
  }

  const settingGroups = [
    {
      title: 'Display',
      items: [
        { label: 'Theme', type: 'select', key: 'theme', options: ['dark', 'light'] },
        { label: 'Primary Color', type: 'select', key: 'theme_color', options: ['cyan', 'purple', 'green'] },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { label: 'Enable Notifications', type: 'toggle', key: 'notifications' },
        { label: 'Email Alerts', type: 'toggle', key: 'emailAlerts' },
      ],
    },
    {
      title: 'Performance',
      items: [
        { label: 'Auto Refresh', type: 'toggle', key: 'autoRefresh' },
        { label: 'Refresh Interval (ms)', type: 'input', key: 'refreshInterval' },
      ],
    },
  ]

  return (
    <MainLayout user={user}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Settings</h1>
        <p className="text-white/60">Configure dashboard preferences and system settings</p>
      </motion.div>

      {/* Settings Sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="space-y-6 max-w-2xl"
      >
        {settingGroups.map((group, groupIdx) => (
          <motion.div
            key={group.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: groupIdx * 0.1 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">{group.title}</h3>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <label className="text-white">{item.label}</label>

                    {item.type === 'toggle' && (
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }))}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          settings[item.key]
                            ? 'bg-cyan-500'
                            : 'bg-white/10'
                        }`}
                      >
                        <motion.div
                          animate={{ x: settings[item.key] ? 24 : 2 }}
                          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full"
                        />
                      </button>
                    )}

                    {item.type === 'select' && (
                      <select
                        value={settings[item.key]}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          [item.key]: e.target.value,
                        }))}
                        className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500/50 outline-none"
                      >
                        {item.options.map((opt) => (
                          <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                        ))}
                      </select>
                    )}

                    {item.type === 'input' && (
                      <input
                        type="number"
                        value={settings[item.key]}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          [item.key]: parseInt(e.target.value),
                        }))}
                        className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white w-32 focus:border-cyan-500/50 outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Button onClick={handleSave}>
            <Save size={16} className="mr-2" />
            Save Settings
          </Button>
          <Button variant="secondary">
            <RotateCcw size={16} className="mr-2" />
            Reset to Defaults
          </Button>
        </motion.div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 max-w-2xl"
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-2">System Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Version:</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Environment:</span>
              <span className="text-white">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">API Backend:</span>
              <span className="text-white">http://localhost:3000</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default SettingsPage
