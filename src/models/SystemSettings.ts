import mongoose, { Schema, Document } from 'mongoose'

export interface ISystemSettings extends Document {
  // System Status
  serverStatus: {
    status: 'online' | 'offline' | 'maintenance'
    uptime: number
  }
  databaseStatus: {
    status: 'healthy' | 'warning' | 'critical'
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
  
  // Database Management
  lastBackup: Date | null
  
  // Security Settings
  security: {
    forceHttps: boolean
    apiRateLimiting: boolean
    ipWhitelist: boolean
    require2FA: boolean
  }
  
  // Email Configuration
  emailConfig: {
    smtpServer: string
    smtpPort: string
    fromEmail: string
    username: string
    password: string
  }
  
  // API Configuration
  apiConfig: {
    version: string
    rateLimit: string
    apiKey: string
  }
  
  updatedAt: Date
}

const SystemSettingsSchema: Schema = new Schema(
  {
    serverStatus: {
      status: {
        type: String,
        enum: ['online', 'offline', 'maintenance'],
        default: 'online'
      },
      uptime: { type: Number, default: 99.9 }
    },
    databaseStatus: {
      status: {
        type: String,
        enum: ['healthy', 'warning', 'critical'],
        default: 'healthy'
      },
      size: { type: String, default: '0 MB' }
    },
    memoryUsage: {
      percentage: { type: Number, default: 0 },
      used: { type: String, default: '0 GB' },
      total: { type: String, default: '10 GB' }
    },
    storageUsage: {
      percentage: { type: Number, default: 0 },
      used: { type: String, default: '0 GB' },
      total: { type: String, default: '100 GB' }
    },
    lastBackup: { type: Date, default: null },
    security: {
      forceHttps: { type: Boolean, default: true },
      apiRateLimiting: { type: Boolean, default: true },
      ipWhitelist: { type: Boolean, default: false },
      require2FA: { type: Boolean, default: true }
    },
    emailConfig: {
      smtpServer: { type: String, default: 'smtp.gmail.com' },
      smtpPort: { type: String, default: '587' },
      fromEmail: { type: String, default: 'noreply@celebritypersona.com' },
      username: { type: String, default: '' },
      password: { type: String, default: '' }
    },
    apiConfig: {
      version: { type: String, default: 'v1.0' },
      rateLimit: { type: String, default: '1000 requests/hour' },
      apiKey: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.SystemSettings ||
  mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema)
