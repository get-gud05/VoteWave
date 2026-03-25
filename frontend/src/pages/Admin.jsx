import { CANDIDATES } from '../utils/candidates'

const FRAUD_LOGS = [
  { user: 'u_9f2b**', score: 0.91, risk: 'high',   time: '14:32', action: 'Blocked' },
  { user: 'u_3a7c**', score: 0.74, risk: 'high',   time: '13:58', action: 'Blocked' },
  { user: 'u_5e1d**', score: 0.48, risk: 'medium', time: '13:21', action: 'Flagged' },
  { user: 'u_2b8f**', score: 0.31, risk: 'medium', time: '12:44', action: 'Flagged' },
  { user: 'u_7g4h**', score: 0.12, risk: 'low',    time: '11:09', action: 'Allowed' },
]

const riskStyle = {
  high:   { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
  medium: { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b' },
  low:    { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e' },
}

const total = CANDIDATES.reduce((s, c) => s + c.votes, 0)
const BAR_COLORS = ['#f5c6e0', '#b8f0d8', '#b8d8f0', '#f5d8b0', '#d4b8f0']

export default function Admin() {
  return (
    <div className="page-enter min-h-[calc(100vh-66px)] pt-[66px] pb-12">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1
              className="font-bebas text-[#111010] leading-[0.88]"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
            >
              ADMIN<br />PANEL
            </h1>
            <p className="font-dm text-[0.78rem] uppercase tracking-[1px] text-[#7a7a9a] mt-2">
              March 25, 2026 · Live Election Dashboard
            </p>
          </div>
          <span
            className="inline-flex items-center gap-2 font-dm text-[0.75rem] font-semibold px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(255,107,53,0.1)', color: '#ff6b35', border: '1px solid rgba(255,107,53,0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] animate-pulse-dot" />
            Live
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: '🗳️', value: '4,218', label: 'Total Votes' },
            { icon: '👥', value: '5,890', label: 'Registered' },
            { icon: '🚨', value: '7',     label: 'Fraud Flags' },
            { icon: '📈', value: '71.6%', label: 'Turnout Rate' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="font-bebas text-[2.4rem] text-[#111010] leading-none">{s.value}</div>
              <div className="font-dm text-[0.72rem] uppercase tracking-[1px] text-[#7a7a9a] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bebas text-[1.45rem] tracking-wide text-[#111010]">Votes Per Candidate</h2>
              <span className="font-dm text-[0.7rem] px-2.5 py-1 rounded-full text-[#3d3d5c]"
                    style={{ background: 'rgba(0,0,0,0.05)' }}>Live</span>
            </div>
            <div className="space-y-4">
              {CANDIDATES.map((c, i) => {
                const pct = ((c.votes / total) * 100).toFixed(1)
                return (
                  <div key={c.id}>
                    <div className="flex justify-between font-dm text-[0.82rem] mb-1.5">
                      <span className="font-medium text-[#111010]">{c.name}</span>
                      <span className="text-[#7a7a9a]">{c.votes.toLocaleString()} · {pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: BAR_COLORS[i], transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bebas text-[1.45rem] tracking-wide text-[#111010]">Fraud Detection Log</h2>
              <span className="font-dm text-[0.7rem] px-2.5 py-1 rounded-full text-[#3d3d5c]"
                    style={{ background: 'rgba(0,0,0,0.05)' }}>ML Powered</span>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  {['User', 'Score', 'Risk', 'Time', 'Action'].map(h => (
                    <th key={h} className="text-left font-dm text-[0.68rem] uppercase tracking-[1px] text-[#7a7a9a] pb-3 border-b border-black/[0.06]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FRAUD_LOGS.map((f, i) => (
                  <tr key={i} className="border-b border-black/[0.04]">
                    <td className="font-dm text-[0.82rem] text-[#3d3d5c] py-3">{f.user}</td>
                    <td className="font-bebas text-[1.05rem] text-[#111010] py-3">{f.score}</td>
                    <td className="py-3">
                      <span
                        className="font-dm text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full uppercase"
                        style={{ background: riskStyle[f.risk].bg, color: riskStyle[f.risk].color }}
                      >
                        {f.risk}
                      </span>
                    </td>
                    <td className="font-dm text-[0.8rem] text-[#7a7a9a] py-3">{f.time}</td>
                    <td className="font-dm text-[0.8rem] py-3" style={{ color: riskStyle[f.risk].color }}>{f.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 glass-card rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-bebas text-[1.2rem] tracking-wide text-[#111010]">Candidate Management</h3>
            <p className="font-dm text-[0.8rem] text-[#7a7a9a] mt-0.5">Add, edit or remove candidates from the election.</p>
          </div>
          <button className="btn-ghost px-6 py-2.5 rounded-full text-[0.85rem]">
            Manage Candidates →
          </button>
        </div>
      </div>
    </div>
  )
}
