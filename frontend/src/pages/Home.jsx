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

      <div
        className="flex mt-14 rounded-2xl overflow-hidden divide-x divide-black/[0.07] animate-hero-4"
        style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.45)' }}
      >
        {[
          { num: '4.2K', label: 'Votes Cast' },
          { num: '6',    label: 'Candidates' },
          { num: '99.8%',label: 'Fraud Free' },
          { num: '2',    label: 'Days Left' },
        ].map(s => (
          <div key={s.label} className="px-8 py-5 text-center hover:bg-white/30 transition-colors duration-200">
            <div className="font-bebas text-[2.1rem] text-[#111010] leading-none">{s.num}</div>
            <div className="text-[0.68rem] uppercase tracking-[1.2px] text-[#7a7a9a] mt-1 font-dm">{s.label}</div>
          </div>
        ))}
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
