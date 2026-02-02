'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'appearance' | 'api'>('general')
  const [settings, setSettings] = useState({
    siteName: 'Celebrity Platform',
    siteUrl: 'https://celebrityplatform.com',
    siteDescription: 'Your ultimate destination for celebrity fashion and news',
    contactEmail: 'admin@celebrityplatform.com',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    twoFactorAuth: false,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordMinLength: '8',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    securityAlerts: true,
    theme: 'system',
    dateFormat: 'MM/DD/YYYY',
    timeZone: 'UTC',
    language: 'en',
  })

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const handleInputChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!')
  }

  const tabs = [
    { id: 'general', label: 'General', icon: 'mdi:cog' },
    { id: 'security', label: 'Security', icon: 'mdi:shield-lock' },
    { id: 'notifications', label: 'Notifications', icon: 'mdi:bell' },
    { id: 'appearance', label: 'Appearance', icon: 'mdi:palette' },
    { id: 'api', label: 'API & Integrations', icon: 'mdi:api' },
  ]

  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-black dark:text-white'>
              System Settings
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Configure and manage system preferences.
            </p>
          </div>
          <button
            onClick={handleSave}
            className='flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors'
          >
            <Icon icon='mdi:content-save' width='20' height='20' />
            <span>Save Changes</span>
          </button>
        </div>

        {/* Tabs */}
        <div className='bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden'>
          <div className='flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Icon icon={tab.icon} width='20' height='20' />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className='p-6'>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Site Name
                  </label>
                  <input
                    type='text'
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Site URL
                  </label>
                  <input
                    type='url'
                    value={settings.siteUrl}
                    onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                    rows={3}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Contact Email
                  </label>
                  <input
                    type='email'
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                  <div>
                    <p className='font-medium text-black dark:text-white'>Maintenance Mode</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Put the site in maintenance mode
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('maintenanceMode')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.maintenanceMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                        settings.maintenanceMode ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                  <div>
                    <p className='font-medium text-black dark:text-white'>Allow Registration</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Allow new users to register
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('allowRegistration')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.allowRegistration ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                        settings.allowRegistration ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                  <div>
                    <p className='font-medium text-black dark:text-white'>Email Verification</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Require email verification for new accounts
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('requireEmailVerification')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.requireEmailVerification ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                        settings.requireEmailVerification ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                  <div>
                    <p className='font-medium text-black dark:text-white'>Two-Factor Authentication</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Enable 2FA for all users
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('twoFactorAuth')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                        settings.twoFactorAuth ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Session Timeout (minutes)
                  </label>
                  <input
                    type='number'
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Max Login Attempts
                  </label>
                  <input
                    type='number'
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Minimum Password Length
                  </label>
                  <input
                    type='number'
                    value={settings.passwordMinLength}
                    onChange={(e) => handleInputChange('passwordMinLength', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div className='p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl'>
                  <div className='flex gap-3'>
                    <Icon icon='mdi:alert' className='text-yellow-600 flex-shrink-0' width='24' height='24' />
                    <div>
                      <p className='font-medium text-yellow-800 dark:text-yellow-200 mb-1'>
                        Security Recommendations
                      </p>
                      <ul className='text-sm text-yellow-700 dark:text-yellow-300 space-y-1'>
                        <li>• Enable two-factor authentication for enhanced security</li>
                        <li>• Use a minimum password length of 12 characters</li>
                        <li>• Limit login attempts to prevent brute force attacks</li>
                        <li>• Set session timeout to 30 minutes or less</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                  <div>
                    <p className='font-medium text-black dark:text-white'>Email Notifications</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Receive system notifications via email
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('emailNotifications')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                        settings.emailNotifications ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                  <div>
                    <p className='font-medium text-black dark:text-white'>Push Notifications</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Receive browser push notifications
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('pushNotifications')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                        settings.pushNotifications ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                  <div>
                    <p className='font-medium text-black dark:text-white'>Weekly Reports</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Receive weekly analytics reports
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('weeklyReports')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.weeklyReports ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                        settings.weeklyReports ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                  <div>
                    <p className='font-medium text-black dark:text-white'>Security Alerts</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Get notified about security events
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('securityAlerts')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.securityAlerts ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                        settings.securityAlerts ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl'>
                  <div className='flex gap-3'>
                    <Icon icon='mdi:information' className='text-blue-600 flex-shrink-0' width='24' height='24' />
                    <div>
                      <p className='font-medium text-blue-800 dark:text-blue-200 mb-1'>
                        Notification Preferences
                      </p>
                      <p className='text-sm text-blue-700 dark:text-blue-300'>
                        Configure which notifications you want to receive. Security alerts are highly recommended to stay informed about important system events.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='system'>System Default</option>
                    <option value='light'>Light</option>
                    <option value='dark'>Dark</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Date Format
                  </label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='MM/DD/YYYY'>MM/DD/YYYY</option>
                    <option value='DD/MM/YYYY'>DD/MM/YYYY</option>
                    <option value='YYYY-MM-DD'>YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Time Zone
                  </label>
                  <select
                    value={settings.timeZone}
                    onChange={(e) => handleInputChange('timeZone', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='UTC'>UTC</option>
                    <option value='America/New_York'>Eastern Time (ET)</option>
                    <option value='America/Chicago'>Central Time (CT)</option>
                    <option value='America/Denver'>Mountain Time (MT)</option>
                    <option value='America/Los_Angeles'>Pacific Time (PT)</option>
                    <option value='Europe/London'>London (GMT)</option>
                    <option value='Asia/Tokyo'>Tokyo (JST)</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='en'>English</option>
                    <option value='es'>Spanish</option>
                    <option value='fr'>French</option>
                    <option value='de'>German</option>
                    <option value='ja'>Japanese</option>
                    <option value='zh'>Chinese</option>
                  </select>
                </div>

                <div className='p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl'>
                  <h3 className='font-medium text-black dark:text-white mb-4'>Theme Preview</h3>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='text-center'>
                      <div className='w-full h-24 bg-white rounded-lg shadow-lg mb-2' />
                      <p className='text-sm text-gray-600 dark:text-gray-400'>Light</p>
                    </div>
                    <div className='text-center'>
                      <div className='w-full h-24 bg-gray-900 rounded-lg shadow-lg mb-2' />
                      <p className='text-sm text-gray-600 dark:text-gray-400'>Dark</p>
                    </div>
                    <div className='text-center'>
                      <div className='w-full h-24 bg-gradient-to-br from-white to-gray-900 rounded-lg shadow-lg mb-2' />
                      <p className='text-sm text-gray-600 dark:text-gray-400'>System</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API & Integrations Settings */}
            {activeTab === 'api' && (
              <div className='space-y-6'>
                <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <p className='font-medium text-black dark:text-white'>API Key</p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Your secret API key for integration
                      </p>
                    </div>
                    <button className='px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-white dark:hover:bg-gray-950 transition-colors'>
                      Regenerate
                    </button>
                  </div>
                  <div className='flex items-center gap-2'>
                    <input
                      type='text'
                      value='sk_live_••••••••••••••••••••••••••••'
                      readOnly
                      className='flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-lg'
                    />
                    <button className='p-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-white dark:hover:bg-gray-950 transition-colors'>
                      <Icon icon='mdi:content-copy' width='20' height='20' />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className='font-medium text-black dark:text-white mb-4'>Webhook Endpoints</h3>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl'>
                      <div>
                        <p className='font-medium text-black dark:text-white'>User Events</p>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          https://api.example.com/webhooks/users
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <button className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'>
                          <Icon icon='mdi:pencil' width='20' height='20' />
                        </button>
                        <button className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'>
                          <Icon icon='mdi:delete' width='20' height='20' />
                        </button>
                      </div>
                    </div>
                    <div className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl'>
                      <div>
                        <p className='font-medium text-black dark:text-white'>Content Events</p>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          https://api.example.com/webhooks/content
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <button className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'>
                          <Icon icon='mdi:pencil' width='20' height='20' />
                        </button>
                        <button className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'>
                          <Icon icon='mdi:delete' width='20' height='20' />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className='mt-4 flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
                    <Icon icon='mdi:plus' width='20' height='20' />
                    <span>Add Webhook</span>
                  </button>
                </div>

                <div>
                  <h3 className='font-medium text-black dark:text-white mb-4'>Connected Services</h3>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center'>
                          <Icon icon='mdi:cloud' className='text-white' width='24' height='24' />
                        </div>
                        <div>
                          <p className='font-medium text-black dark:text-white'>Cloud Storage</p>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>Connected</p>
                        </div>
                      </div>
                      <button className='px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
                        Disconnect
                      </button>
                    </div>
                    <div className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center'>
                          <Icon icon='mdi:email' className='text-white' width='24' height='24' />
                        </div>
                        <div>
                          <p className='font-medium text-black dark:text-white'>Email Service</p>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>Connected</p>
                        </div>
                      </div>
                      <button className='px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>

                <div className='p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl'>
                  <div className='flex gap-3'>
                    <Icon icon='mdi:code-tags' className='text-purple-600 flex-shrink-0' width='24' height='24' />
                    <div>
                      <p className='font-medium text-purple-800 dark:text-purple-200 mb-1'>
                        API Documentation
                      </p>
                      <p className='text-sm text-purple-700 dark:text-purple-300 mb-2'>
                        Visit our comprehensive API documentation to learn how to integrate with our platform.
                      </p>
                      <a
                        href='/documentation'
                        className='text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline'
                      >
                        View Documentation →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
