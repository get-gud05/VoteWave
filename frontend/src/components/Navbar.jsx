import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = (path) =>
    `text-[0.78rem] font-dm font-medium uppercase tracking-[0.6px] px-4 py-2 rounded-full transition-all duration-200 cursor-pointer
     ${pathname === path
       ? 'bg-white/50 text-[#111010]'
       : 'text-[#3d3d5c] hover:bg-white/40 hover:text-[#111010]'}`

  return (
    <nav className="glass-nav">
      <Link
        to="/"
        className="font-bebas text-[1.75rem] tracking-[2px] text-[#111010] flex items-center gap-1 no-underline"
      >
        VOTE
        <span className="inline-block w-2 h-2 rounded-full bg-[#ff6b35] mb-1" />
        WAVE
      </Link>

      <div className="flex items-center gap-1">
        <Link to="/" className={linkClass('/')}>Home</Link>
        {user && user.role === 'voter' && (
          <Link to="/vote" className={linkClass('/vote')}>Vote</Link>
        )}
        {user && user.role === 'admin' && (
          <Link to="/admin" className={linkClass('/admin')}>Admin</Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="text-[0.78rem] font-dm text-[#3d3d5c] px-3 hidden sm:block">
              👋 {user.name.split(' ')[0]}
            </span>
            {user.role === 'admin' && (
              <span className="text-[0.7rem] font-dm font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] border border-[#ff6b35]/20">
                Admin
              </span>
            )}
            <button
              onClick={handleLogout}
              className="btn-ghost text-[0.78rem] px-4 py-2 rounded-full"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={linkClass('/login')}>Login</Link>
            <Link
              to="/register"
              className="btn-dark text-[0.78rem] px-5 py-2 rounded-full no-underline"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
