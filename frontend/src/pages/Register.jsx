import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', voterId: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { register, showToast } = useAuth()
  const navigate              = useNavigate()

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const { name, email, voterId, password, confirm } = form
    if (!name || !email || !voterId || !password || !confirm) { setError('Please fill in all fields.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    setTimeout(() => {
      const res = register(name, email, password)
      setLoading(false)
      if (!res.ok) { setError(res.error); return }
      showToast('Account created! Welcome to VoteWave 🎉')
      navigate('/vote')
    }, 700)
  }

  return (
    <div className="page-enter min-h-[calc(100vh-66px)] pt-[66px] flex">

      {/* Left branding */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center px-12 relative overflow-hidden">
        <h2
          className="font-bebas text-[#111010] text-center leading-[0.88] z-10 relative"
          style={{ fontSize: 'clamp(3.5rem, 7vw, 7rem)' }}
        >
          JOIN THE<br />WAVE
        </h2>
        <p className="font-playfair italic text-[#3d3d5c] text-lg mt-3 z-10 relative">
          Your voice shapes tomorrow.
        </p>
        <div
          className="absolute bottom-[-30px] right-[-20px] font-bebas text-[12rem] leading-none pointer-events-none select-none"
          style={{ opacity: 0.06, color: '#111010' }}
        >
          📋
        </div>
      </div>

      {/* Right form */}
      <div className="glass-panel w-full md:w-[460px] md:min-w-[400px] flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-[360px]">
          <h3 className="font-bebas text-[2.8rem] tracking-wide text-[#111010]">Register</h3>
          <p className="font-dm text-[0.85rem] text-[#7a7a9a] mt-1 mb-6">
            Already registered?{' '}
            <Link to="/login" className="text-[#ff6b35] font-medium no-underline hover:underline">
              Sign in →
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {[
              { label: 'Full Name',      field: 'name',     type: 'text',     placeholder: 'Your full name' },
              { label: 'Email Address',  field: 'email',    type: 'email',    placeholder: 'you@example.com' },
              { label: 'Voter ID',       field: 'voterId',  type: 'text',     placeholder: 'e.g. VTR-2024-XXXX' },
              { label: 'Password',       field: 'password', type: 'password', placeholder: 'Min 8 characters' },
              { label: 'Confirm Password', field: 'confirm', type: 'password', placeholder: 'Repeat password' },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="block text-[0.72rem] font-dm font-medium uppercase tracking-[0.8px] text-[#3d3d5c] mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  className="form-input"
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={set(field)}
                />
              </div>
            ))}

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
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
