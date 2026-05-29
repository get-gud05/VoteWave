import { useEffect, useState } from 'react'
import API from '../services/api'

const BAR_COLORS = ['#f5c6e0', '#b8f0d8', '#b8d8f0', '#f5d8b0', '#d4b8f0']

export default function Admin() {
  const [candidates, setCandidates] = useState([])
  const [usersSuspicion, setUsersSuspicion] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '' })
  const [adding, setAdding] = useState(false)
  const [formError, setFormError] = useState(null)
  const [resetting, setResetting] = useState(false)
  const [activeTab, setActiveTab] = useState('results')

  useEffect(() => {
    fetchCandidates()
    fetchUsersSuspicion()
  }, [])

  const fetchCandidates = async () => {
    try {
      const res = await API.get('/candidates')
      setCandidates(res.data || [])
    } catch (err) {
      setError('Failed to fetch candidates')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsersSuspicion = async () => {
    try {
      const res = await API.get('/admin/users-suspicion')
      setUsersSuspicion(res.data || [])
    } catch (err) {
      console.error('Failed to fetch users suspicion', err)
    }
  }

  const handleAddCandidate = async (e) => {
    e.preventDefault()
    setFormError(null)
    setError(null)

    if (!formData.name.trim()) {
      setFormError('Please enter a candidate name')
      return
    }

    setAdding(true)
    try {
      const res = await API.post('/candidates', {
        name: formData.name.trim(),
      })
      setCandidates([...candidates, res.data])
      setFormData({ name: '' })
      setShowModal(false)
    } catch (err) {
      setFormError('Failed to add candidate')
      console.error(err)
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Are you sure you want to remove this candidate?')) return

    try {
      await API.delete(`/candidates/${id}`)
      setCandidates(candidates.filter(c => (c._id || c.id) !== id))
      setError(null)
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete candidate')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleResetElection = async () => {
    if (!window.confirm('Are you sure you want to reset the election? This will delete all candidates and give all users their votes back.')) return

    setResetting(true)
    setError(null)
    try {
      await API.post('/admin/reset-election')
      setCandidates([])
      setUsersSuspicion([])
      setError(null)
      alert('Election reset successfully!')
    } catch (err) {
      console.error('Reset error:', err)
      setError('Failed to reset election')
      setTimeout(() => setError(null), 3000)
    } finally {
      setResetting(false)
    }
  }

  const total = candidates.reduce((s, c) => s + (c.votes || 0), 0)

  return (
    <div className="page-enter min-h-[calc(100vh-66px)] pt-[66px] pb-12">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1
              className="font-bebas text-[#111010] leading-[0.88]"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}
            >
              ELECTION<br />RESULTS
            </h1>
            <p className="font-dm text-[0.78rem] uppercase tracking-[1px] text-[#7a7a9a] mt-2">
              Live Voting Dashboard
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

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-6 py-2.5 rounded-full text-[0.85rem] font-dm font-semibold transition-all ${
              activeTab === 'results'
                ? 'btn-dark'
                : 'btn-ghost'
            }`}
          >
            Voting Results
          </button>
          <button
            onClick={() => setActiveTab('suspicion')}
            className={`px-6 py-2.5 rounded-full text-[0.85rem] font-dm font-semibold transition-all ${
              activeTab === 'suspicion'
                ? 'btn-dark'
                : 'btn-ghost'
            }`}
          >
            User Suspicion Report
          </button>
        </div>

        {/* Results Tab */}
        {activeTab === 'results' && (
          <>
            <div className="glass-card rounded-2xl p-8 max-w-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bebas text-[1.8rem] tracking-wide text-[#111010]">Candidate Votes</h2>
                <span className="font-dm text-[0.85rem] font-semibold text-[#7a7a9a]">
                  Total: {total.toLocaleString()}
                </span>
              </div>

              {loading && <p className="text-[0.85rem] text-[#7a7a9a]">Loading candidates...</p>}
              {error && <p className="text-[0.85rem] text-red-500">{error}</p>}
              {!loading && !error && candidates.length === 0 && (
                <p className="text-[0.85rem] text-[#7a7a9a]">No candidates found</p>
              )}

              <div className="space-y-6">
                {!loading && !error && candidates.map((c, i) => {
                  const pct = total > 0 ? (((c.votes || 0) / total) * 100).toFixed(1) : 0
                  return (
                    <div key={c._id || c.id || i}>
                      <div className="flex justify-between items-center font-dm text-[0.95rem] mb-2">
                        <span className="font-semibold text-[#111010]">{c.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bebas text-[1.3rem] text-[#ff6b35]">{c.votes || 0}</span>
                          <button
                            onClick={() => handleDeleteCandidate(c._id || c.id)}
                            className="text-red-500 hover:text-red-700 transition-colors text-[0.8rem] font-medium"
                            title="Remove candidate"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: BAR_COLORS[i % BAR_COLORS.length], transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)' }}
                        />
                      </div>
                      <p className="text-[0.72rem] text-[#7a7a9a] mt-1">{pct}%</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 glass-card rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bebas text-[1.3rem] tracking-wide text-[#111010]">Add Candidates</h3>
                <p className="font-dm text-[0.8rem] text-[#7a7a9a] mt-0.5">Add new candidates to the election.</p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="btn-dark px-6 py-2.5 rounded-full text-[0.85rem]"
              >
                + Add Candidate
              </button>
            </div>

            <div className="mt-8 glass-card rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bebas text-[1.3rem] tracking-wide text-[#111010]">Reset Election</h3>
                <p className="font-dm text-[0.8rem] text-[#7a7a9a] mt-0.5">Clear all candidates and reset user votes.</p>
              </div>
              <button 
                onClick={handleResetElection}
                disabled={resetting}
                className="px-6 py-2.5 rounded-full text-[0.85rem] bg-red-500 hover:bg-red-600 text-white font-dm font-semibold disabled:opacity-60"
              >
                {resetting ? 'Resetting...' : '↻ Reset Election'}
              </button>
            </div>
          </>
        )}

        {/* Suspicion Report Tab */}
        {activeTab === 'suspicion' && (
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-bebas text-[1.8rem] tracking-wide text-[#111010] mb-6">User Suspicion Report</h2>
            
            {usersSuspicion.length === 0 ? (
              <p className="text-[0.85rem] text-[#7a7a9a]">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[0.85rem]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-dm font-semibold text-[#111010]">User Name</th>
                      <th className="text-left py-3 px-4 font-dm font-semibold text-[#111010]">Email</th>
                      <th className="text-center py-3 px-4 font-dm font-semibold text-[#111010]">Suspicion %</th>
                      <th className="text-center py-3 px-4 font-dm font-semibold text-[#111010]">Voted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersSuspicion.map((user, idx) => {
                      const suspicion = parseFloat(user.suspicionPercentage)
                      let suspicionColor = '#22c55e'
                      if (suspicion > 70) suspicionColor = '#ef4444'
                      else if (suspicion > 40) suspicionColor = '#f59e0b'
                      
                      return (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 font-dm text-[#111010]">{user.name}</td>
                          <td className="py-3 px-4 font-dm text-[#7a7a9a] text-[0.8rem]">{user.email}</td>
                          <td className="py-3 px-4 text-center">
                            <span 
                              className="font-bebas font-semibold"
                              style={{ color: suspicionColor }}
                            >
                              {user.suspicionPercentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block w-4 h-4 rounded-full" 
                              style={{ background: user.hasVoted ? '#22c55e' : '#d1d5db' }}
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-in">
              <h3 className="font-bebas text-[1.8rem] tracking-wide text-[#111010] mb-6">Add New Candidate</h3>
              
              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div>
                  <label className="block text-[0.72rem] font-dm font-medium uppercase tracking-[0.8px] text-[#3d3d5c] mb-1.5">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    className="form-input w-full"
                    placeholder="e.g., John Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {formError && (
                  <p className="text-[0.82rem] font-dm text-red-500 bg-red-50/60 px-3 py-2 rounded-lg">
                    {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-ghost flex-1 py-2.5 rounded-lg text-[0.85rem]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="btn-dark flex-1 py-2.5 rounded-lg text-[0.85rem] disabled:opacity-60"
                  >
                    {adding ? 'Adding...' : 'Add Candidate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
