import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login, showToast }    = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setTimeout(() => {
      const res = login(email, password)
      setLoading(false)
      if (!res.ok) { setError(res.error); return }
      showToast(`Welcome back! 👋`)
      navigate(res.role === 'admin' ? '/admin' : '/vote')
    }, 600)
  }

  return (
    <div className="page-enter min-h-[calc(100vh-66px)] pt-[66px] flex">

      <div className="hidden md:flex flex-1 flex-col items-center justify-center px-12 relative overflow-hidden">
        <h2
          className="font-bebas text-[#111010] text-center leading-[0.88] z-10 relative"
          style={{ fontSize: 'clamp(3.5rem, 7vw, 7rem)' }}
        >
          WELCOME<br />BACK
        </h2>
        <p className="font-playfair italic text-[#3d3d5c] text-lg mt-3 z-10 relative">
          Your vote is waiting.
        </p>
        <div
          className="absolute bottom-[-30px] right-[-20px] font-bebas text-[12rem] leading-none pointer-events-none select-none"
          style={{ opacity: 0.06, color: '#111010' }}
        >
          🗳️
        </div>
      </div>

      <div className="glass-panel w-full md:w-[460px] md:min-w-[400px] flex items-center justify-center px-8 py-14">
        <div className="w-full max-w-[360px]">
          <h3 className="font-bebas text-[2.8rem] tracking-wide text-[#111010]">Sign In</h3>
          <p className="font-dm text-[0.85rem] text-[#7a7a9a] mt-1 mb-7">
            No account?{' '}
            <Link to="/register" className="text-[#ff6b35] font-medium no-underline hover:underline">
              Create one →
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.72rem] font-dm font-medium uppercase tracking-[0.8px] text-[#3d3d5c] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[0.72rem] font-dm font-medium uppercase tracking-[0.8px] text-[#3d3d5c] mb-1.5">
                Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-[0.82rem] font-dm text-red-500 bg-red-50/60 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-dark w-full py-3.5 rounded-xl text-[0.92rem] mt-1 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-xl text-[0.75rem] font-dm text-[#7a7a9a]"
               style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)' }}>
            <p className="font-semibold text-[#3d3d5c] mb-1">Demo credentials</p>
            <p>Voter: arjun@example.com / password1</p>
            <p>Admin: admin@votewave.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
