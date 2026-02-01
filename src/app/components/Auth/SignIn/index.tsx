'use client'
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useAuth } from '@/context/AuthContext'

const SignIn = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password)
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className='max-w-md mx-auto'>
      {/* Header */}
      <div className='text-center mb-8'>
        <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
          <Icon icon='mdi:lock' width='32' height='32' className='text-white' />
        </div>
        <h2 className='text-3xl font-bold mb-2'>Welcome Back</h2>
        <p className='text-gray-600'>Sign in to your CelebrityPersona account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 flex items-start gap-3'>
          <Icon icon='mdi:alert-circle' width='20' height='20' className='mt-0.5 flex-shrink-0' />
          <span className='text-sm'>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Email */}
        <div>
          <label htmlFor='email' className='block text-sm font-semibold mb-2'>
            Email Address
          </label>
          <div className='relative'>
            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
              <Icon icon='mdi:email' width='20' height='20' />
            </span>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition'
              placeholder='your@email.com'
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor='password' className='block text-sm font-semibold mb-2'>
            Password
          </label>
          <div className='relative'>
            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
              <Icon icon='mdi:lock' width='20' height='20' />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              className='w-full pl-12 pr-12 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition'
              placeholder='Enter your password'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
              <Icon
                icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'}
                width='20'
                height='20'
              />
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className='text-right'>
          <Link
            href='/forgot-password'
            className='text-sm text-primary hover:underline'>
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full bg-primary text-white py-4 rounded-full font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
          {loading ? (
            <>
              <Icon icon='mdi:loading' width='20' height='20' className='animate-spin' />
              Signing in...
            </>
          ) : (
            <>
              <Icon icon='mdi:login' width='20' height='20' />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className='flex items-center gap-4 my-8'>
        <div className='flex-1 h-px bg-gray-200'></div>
        <span className='text-sm text-gray-500'>or</span>
        <div className='flex-1 h-px bg-gray-200'></div>
      </div>

      {/* Sign Up Link */}
      <div className='text-center'>
        <p className='text-gray-600'>
          Don't have an account?{' '}
          <Link href='/signup' className='text-primary font-semibold hover:underline'>
            Sign Up
          </Link>
        </p>
      </div>

      {/* Back to Home */}
      <div className='text-center mt-6'>
        <Link
          href='/'
          className='text-sm text-gray-500 hover:text-primary transition flex items-center justify-center gap-2'>
          <Icon icon='tabler:arrow-left' width='16' height='16' />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default SignIn
