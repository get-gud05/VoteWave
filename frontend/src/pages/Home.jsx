import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleVoteClick = () => {
    if (!user) { navigate('/register'); return }
    if (user.role === 'admin') { navigate('/admin'); return }
    navigate('/vote')
  }

  return (
    <div className="page-enter min-h-[calc(100vh-66px)] pt-[66px] flex flex-col items-center justify-center text-center px-6 relative">

      <span className="animate-float   absolute top-[16%] left-[7%]  text-5xl pointer-events-none select-none hidden md:block">🗳️</span>
      <span className="animate-float-2 absolute top-[22%] right-[9%] text-4xl pointer-events-none select-none hidden md:block">📊</span>
      <span className="animate-float-3 absolute bottom-[22%] left-[10%] text-4xl pointer-events-none select-none hidden md:block">🔒</span>

      <div className="flex items-center gap-3 mb-6 animate-hero">
        <span className="block w-10 h-px bg-[#7a7a9a]" />
        <span className="text-[0.72rem] font-dm font-medium uppercase tracking-[3px] text-[#3d3d5c]">
          Secure · Smart · Verified
        </span>
        <span className="block w-10 h-px bg-[#7a7a9a]" />
      </div>

      <h1
        className="font-bebas leading-[0.88] text-[#111010] animate-hero-2"
        style={{ fontSize: 'clamp(5rem, 17vw, 13rem)', letterSpacing: '-1px' }}
      >
        VOTE<br />WAVE
      </h1>

      <p className="font-playfair italic text-[#3d3d5c] mt-4 animate-hero-3"
         style={{ fontSize: 'clamp(1rem, 2.2vw, 1.35rem)' }}>
        <strong className="font-dm not-italic uppercase text-[0.85em] tracking-wider">Every</strong> voice{' '}
        <em>needs</em>{' '}
        <strong className="font-dm not-italic uppercase text-[0.85em] tracking-wider">a stage</strong>
      </p>

      <div className="flex gap-3 mt-10 animate-hero-4 flex-wrap justify-center">
        <button
          onClick={handleVoteClick}
          className="btn-dark px-9 py-3.5 rounded-full text-[0.9rem]"
        >
          {user ? (user.role === 'admin' ? 'View Dashboard →' : 'Cast Your Vote →') : 'Start Voting →'}
        </button>
        {!user && (
          <button
            onClick={() => navigate('/login')}
            className="btn-ghost px-9 py-3.5 rounded-full text-[0.9rem]"
          >
            Sign In
          </button>
        )}
      </div>
      <button
        onClick={handleVoteClick}
        className="animate-badge absolute bottom-[13%] right-[6%] hidden lg:flex flex-col items-center justify-center w-28 h-28 rounded-full text-white font-bebas text-[1.3rem] leading-[1.1] cursor-pointer"
        style={{ background: '#FF9500', boxShadow: '0 8px 28px rgba(255,149,0,0.38)', border: 'none' }}
      >
        CAST<br />VOTE
        <span className="font-dm text-[0.55rem] font-medium tracking-[2px] uppercase mt-0.5">Now</span>
      </button>
    </div>
  )
}
