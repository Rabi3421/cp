'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'

interface SystemStatus {
  serverStatus: {
    status: string
    uptime: number
  }
  databaseStatus: {
    status: string
    size: string
  }
  memoryUsage: {
    percentage: number
    used: string
    total: string
  }
  storageUsage: {
    percentage: number
    used: string
    total: string
  }
  lastBackup: string | null
  security: {
    forceHttps: boolean
    apiRateLimiting: boolean
    ipWhitelist: boolean
    require2FA: boolean
  }
  emailConfig: {
    smtpServer: string
    smtpPort: string
    fromEmail: string
    username: string
    password: string
  }
  apiConfig: {
    version: string
    rateLimit: string
    apiKey: string
  }
}

export default function SystemPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: '',
    smtpPort: '',
    fromEmail: '',
    username: '',
    password: ''
  })
  const [apiConfig, setApiConfig] = useState({
    version: 'v1.0',
    rateLimit: '',
    apiKey: ''
  })
  const [security, setSecurity] = useState({
    forceHttps: true,
    apiRateLimiting: true,
    ipWhitelist: false,
    require2FA: true
  })

  useEffect(() => {
    fetchSystemStatus()
  }, [])

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/superadmin/system/status', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setSystemStatus(data)
        setSecurity(data.security)
        setEmailConfig(data.emailConfig)
        setApiConfig(data.apiConfig)
      }
    } catch (error) {
      console.error('Error fetching system status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackup = async () => {
    try {
      const response = await fetch('/api/superadmin/system/database/backup', {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok) {
        alert(data.message)
        fetchSystemStatus()
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      alert('Failed to create backup')
    }
  }

  const handleRestore = async () => {
    if (!confirm('Are you sure you want to restore the database? This action cannot be undone.')) {
      return
    }
    try {
      const response = await fetch('/api/superadmin/system/database/restore', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId: 'latest' })
      })
      const data = await response.json()
      if (response.ok) {
        alert(data.message)
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error restoring database:', error)
      alert('Failed to restore database')
    }
  }

  const handleOptimize = async () => {
    try {
      const response = await fetch('/api/superadmin/system/database/optimize', {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok) {
        alert(data.message)
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error optimizing database:', error)
      alert('Failed to optimize database')
    }
  }

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear all cached data?')) {
      return
    }
    try {
      const response = await fetch('/api/superadmin/system/database/cache', {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok) {
        alert(data.message)
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
      alert('Failed to clear cache')
    }
  }

  const handleSecurityToggle = async (key: keyof typeof security) => {
    const newSecurity = { ...security, [key]: !security[key] }
    setSecurity(newSecurity)
    
    try {
      const response = await fetch('/api/superadmin/system/security', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ security: newSecurity })
      })
      if (!response.ok) {
        setSecurity(security)
        alert('Failed to update security settings')
      }
    } catch (error) {
      console.error('Error updating security:', error)
      setSecurity(security)
    }
  }

  const handleTestEmail = async () => {
    try {
      const response = await fetch('/api/superadmin/system/email/test', {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok) {
        alert(data.message)
      } else {
        alert(data.error || 'Email test failed')
      }
    } catch (error) {
      console.error('Error testing email:', error)
      alert('Failed to test email connection')
    }
  }

  const handleRegenerateApiKey = async () => {
    if (!confirm('Are you sure you want to regenerate the API key? The old key will stop working.')) {
      return
    }
    try {
      const response = await fetch('/api/superadmin/system/api-config/regenerate', {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok) {
        alert(`New API Key: ${data.apiKey}`)
        setApiConfig({ ...apiConfig, apiKey: data.apiKey })
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error regenerating API key:', error)
      alert('Failed to regenerate API key')
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const emailResponse = await fetch('/api/superadmin/system/email', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailConfig })
      })

      const apiResponse = await fetch('/api/superadmin/system/api-config', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiConfig })
      })

      if (emailResponse.ok && apiResponse.ok) {
        alert('All settings saved successfully')
        fetchSystemStatus()
      } else {
        alert('Failed to save some settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout requiredRole='superadmin'>
        <div className='flex items-center justify-center h-96'>
          <Icon icon='mdi:loading' className='animate-spin text-4xl text-primary' />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-black dark:text-white'>
            System Configuration
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Manage system settings and configurations.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-3 mb-3'>
              <Icon icon='mdi:server' width='24' height='24' className='text-blue-500' />
              <h3 className='font-semibold text-lg text-black dark:text-white'>Server</h3>
            </div>
            <p className='text-2xl font-bold text-green-500 mb-1 capitalize'>
              {systemStatus?.serverStatus.status || 'Online'}
            </p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              Uptime: {systemStatus?.serverStatus.uptime || 99.9}%
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-3 mb-3'>
              <Icon icon='mdi:database' width='24' height='24' className='text-green-500' />
              <h3 className='font-semibold text-lg text-black dark:text-white'>Database</h3>
            </div>
            <p className='text-2xl font-bold text-green-500 mb-1 capitalize'>
              {systemStatus?.databaseStatus.status || 'Healthy'}
            </p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              Size: {systemStatus?.databaseStatus.size || '2.4 GB'}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-3 mb-3'>
              <Icon icon='mdi:memory' width='24' height='24' className='text-yellow-500' />
              <h3 className='font-semibold text-lg text-black dark:text-white'>Memory</h3>
            </div>
            <p className='text-2xl font-bold text-yellow-500 mb-1'>
              {systemStatus?.memoryUsage.percentage || 64}%
            </p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              {systemStatus?.memoryUsage.used || '6.4 GB'} / {systemStatus?.memoryUsage.total || '10 GB'}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-3 mb-3'>
              <Icon icon='mdi:harddisk' width='24' height='24' className='text-purple-500' />
              <h3 className='font-semibold text-lg text-black dark:text-white'>Storage</h3>
            </div>
            <p className='text-2xl font-bold text-purple-500 mb-1'>
              {systemStatus?.storageUsage.percentage || 42}%
            </p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              {systemStatus?.storageUsage.used || '42 GB'} / {systemStatus?.storageUsage.total || '100 GB'}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>Database Management</h2>
            <div className='space-y-4'>
              <button onClick={handleBackup} className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='flex items-center gap-3'>
                  <Icon icon='mdi:database-refresh' width='20' height='20' className='text-blue-500' />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>Backup Database</p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      {systemStatus?.lastBackup ? `Last backup: ${new Date(systemStatus.lastBackup).toLocaleString()}` : 'No backup yet'}
                    </p>
                  </div>
                </div>
                <Icon icon='mdi:chevron-right' width='20' height='20' className='text-gray-400' />
              </button>

              <button onClick={handleRestore} className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='flex items-center gap-3'>
                  <Icon icon='mdi:database-import' width='20' height='20' className='text-green-500' />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>Restore Database</p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>Restore from backup</p>
                  </div>
                </div>
                <Icon icon='mdi:chevron-right' width='20' height='20' className='text-gray-400' />
              </button>

              <button onClick={handleOptimize} className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='flex items-center gap-3'>
                  <Icon icon='mdi:database-settings' width='20' height='20' className='text-purple-500' />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>Optimize Database</p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>Clean and optimize</p>
                  </div>
                </div>
                <Icon icon='mdi:chevron-right' width='20' height='20' className='text-gray-400' />
              </button>

              <button onClick={handleClearCache} className='w-full flex items-center justify-between p-4 rounded-xl border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors'>
                <div className='flex items-center gap-3'>
                  <Icon icon='mdi:database-remove' width='20' height='20' className='text-red-500' />
                  <div className='text-left'>
                    <p className='text-red-500 font-medium'>Clear Cache</p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>Clear all cached data</p>
                  </div>
                </div>
                <Icon icon='mdi:chevron-right' width='20' height='20' className='text-red-400' />
              </button>
            </div>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>Security Settings</h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>Force HTTPS</p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>Enforce secure connections</p>
                </div>
                <button onClick={() => handleSecurityToggle('forceHttps')} className={`relative w-12 h-6 rounded-full transition-colors ${security.forceHttps ? 'bg-primary' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${security.forceHttps ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>API Rate Limiting</p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>Limit API requests</p>
                </div>
                <button onClick={() => handleSecurityToggle('apiRateLimiting')} className={`relative w-12 h-6 rounded-full transition-colors ${security.apiRateLimiting ? 'bg-primary' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${security.apiRateLimiting ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>IP Whitelist</p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>Restrict admin access</p>
                </div>
                <button onClick={() => handleSecurityToggle('ipWhitelist')} className={`relative w-12 h-6 rounded-full transition-colors ${security.ipWhitelist ? 'bg-primary' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${security.ipWhitelist ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>2FA Required</p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>Require for all admins</p>
                </div>
                <button onClick={() => handleSecurityToggle('require2FA')} className={`relative w-12 h-6 rounded-full transition-colors ${security.require2FA ? 'bg-primary' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${security.require2FA ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>Email Configuration</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>SMTP Server</label>
                <input type='text' value={emailConfig.smtpServer} onChange={(e) => setEmailConfig({ ...emailConfig, smtpServer: e.target.value })} className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent' />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>SMTP Port</label>
                <input type='text' value={emailConfig.smtpPort} onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })} className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent' />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>From Email</label>
                <input type='email' value={emailConfig.fromEmail} onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })} className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent' />
              </div>
              <button onClick={handleTestEmail} className='w-full px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors'>Test Connection</button>
            </div>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>API Configuration</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>API Version</label>
                <select value={apiConfig.version} onChange={(e) => setApiConfig({ ...apiConfig, version: e.target.value })} className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'>
                  <option>v1.0</option>
                  <option>v2.0 (Beta)</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Rate Limit</label>
                <input type='text' value={apiConfig.rateLimit} onChange={(e) => setApiConfig({ ...apiConfig, rateLimit: e.target.value })} className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent' />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>API Key</label>
                <div className='flex gap-2'>
                  <input type='password' value={apiConfig.apiKey} readOnly className='flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent' />
                  <button onClick={handleRegenerateApiKey} className='px-4 py-3 bg-gray-100 dark:bg-gray-900 text-black dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors'>
                    <Icon icon='mdi:refresh' width='20' height='20' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <button onClick={handleSaveAll} disabled={saving} className='px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
