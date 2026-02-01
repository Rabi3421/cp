'use client'
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

const SignUp = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up')
      }

      // Store user data in localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      // Redirect to home
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up')
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
          <Icon icon='mdi:account-plus' width='32' height='32' className='text-white' />
        </div>
        <h2 className='text-3xl font-bold mb-2'>Create Account</h2>
        <p className='text-gray-600'>Join CelebrityPersona today</p>
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
        {/* Name */}
        <div>
          <label htmlFor='name' className='block text-sm font-semibold mb-2'>
            Full Name
          </label>
          <div className='relative'>
            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
              <Icon icon='mdi:account' width='20' height='20' />
            </span>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
              className='w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition'
              placeholder='John Doe'
            />
          </div>
        </div>

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
              minLength={6}
              className='w-full pl-12 pr-12 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition'
              placeholder='At least 6 characters'
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

        {/* Confirm Password */}
        <div>
          <label htmlFor='confirmPassword' className='block text-sm font-semibold mb-2'>
            Confirm Password
          </label>
          <div className='relative'>
            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
              <Icon icon='mdi:lock-check' width='20' height='20' />
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className='w-full pl-12 pr-12 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition'
              placeholder='Re-enter your password'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
              <Icon
                icon={showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'}
                width='20'
                height='20'
              />
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full bg-primary text-white py-4 rounded-full font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
          {loading ? (
            <>
              <Icon icon='mdi:loading' width='20' height='20' className='animate-spin' />
              Creating account...
            </>
          ) : (
            <>
              <Icon icon='mdi:account-plus' width='20' height='20' />
              Sign Up
            </>
          )}
        </button>
      </form>

      {/* Terms */}
      <div className='mt-6 text-center text-sm text-gray-600'>
        By signing up, you agree to our{' '}
        <Link href='/license' className='text-primary hover:underline'>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href='/license' className='text-primary hover:underline'>
          Privacy Policy
        </Link>
      </div>

      {/* Divider */}
      <div className='flex items-center gap-4 my-8'>
        <div className='flex-1 h-px bg-gray-200'></div>
        <span className='text-sm text-gray-500'>or</span>
        <div className='flex-1 h-px bg-gray-200'></div>
      </div>

      {/* Sign In Link */}
      <div className='text-center'>
        <p className='text-gray-600'>
          Already have an account?{' '}
          <Link href='/signin' className='text-primary font-semibold hover:underline'>
            Sign In
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

export default SignUp
