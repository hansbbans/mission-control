'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple hardcoded password check
    if (password === 'njmeRjLC') {
      // Set a cookie or localStorage flag
      localStorage.setItem('mc-auth', 'true')
      router.push('/')
      router.refresh()
    } else {
      setError('Invalid password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mc-bg">
      <div className="bg-mc-bg-secondary p-8 rounded-lg shadow-xl w-96 border border-mc-border">
        <h1 className="text-3xl font-bold text-mc-text mb-6 text-center">
          🦞 Mission Control
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 bg-mc-bg text-mc-text rounded border border-mc-border focus:outline-none focus:border-mc-accent placeholder-mc-text-secondary"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 bg-mc-accent hover:bg-mc-accent/90 text-mc-bg py-2 rounded font-medium transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
