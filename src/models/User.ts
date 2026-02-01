import mongoose, { Document, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export type UserRole = 'user' | 'admin' | 'superadmin'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  avatar?: string
  isActive: boolean
  refreshToken?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '/images/team/user1.svg',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    return false
  }
}

// Ensure only one superadmin exists
userSchema.pre('save', async function () {
  if (this.role === 'superadmin' && this.isNew) {
    const existingSuperAdmin = await (this.constructor as Model<IUser>).findOne({
      role: 'superadmin',
      _id: { $ne: this._id },
    })

    if (existingSuperAdmin) {
      throw new Error('Only one superadmin can exist in the system')
    }
  }
})

// Prevent deletion/modification of superadmin
userSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate() as any
  
  if (update.role === 'superadmin') {
    const existingSuperAdmin = await this.model.findOne({
      role: 'superadmin',
    })

    if (existingSuperAdmin) {
      throw new Error('Only one superadmin can exist in the system')
    }
  }
})

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User
