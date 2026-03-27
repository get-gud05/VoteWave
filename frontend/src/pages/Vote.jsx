import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CANDIDATES } from '../utils/candidates'
import API from "../services/api";

export default function Vote() {
  const { user, markVoted, showToast } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [backendCandidates, setBackendCandidates] = useState([]);

  useEffect(() => {
    API.get("/candidates")
      .then(res => setBackendCandidates(res.data))
      .catch(() => console.error("Failed to load candidates"));
  }, []);

  console.log("CANDIDATES:", backendCandidates);

  if (user?.hasVoted) {
    return (
      <div className="page-enter min-h-[calc(100vh-66px)] pt-[66px] flex items-center justify-center px-6">
        <div
          className="glass-card rounded-3xl p-12 text-center max-w-md w-full"
          style={{ animation: 'modalIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-bebas text-[2.8rem] text-[#111010] mb-2">Already Voted</h2>
          <p className="font-dm text-[0.9rem] text-[#3d3d5c] mb-6 leading-relaxed">
            You have already cast your vote in this election.
            Each voter may only vote once. Thank you for participating!
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-dark px-8 py-3 rounded-full text-[0.9rem]"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const selectedCandidate = backendCandidates.find(c => c.id === selected)

  const handleSubmit = async () => {
  if (!selected) return;

  setSubmitting(true);

  try {
      await API.post("/vote", {
        userId: user.id,
        candidateId: selected,
      });

      markVoted();
      setShowModal(false);
      showToast("✅ Vote cast successfully");

    } catch (err) {
      showToast("❌ Error voting", "error");
    }

    setSubmitting(false);
  };

  return (
    <div className="page-enter min-h-[calc(100vh-66px)] pt-[66px] pb-36">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-10">
          <h1
            className="font-bebas text-[#111010] leading-[0.88]"
            style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)' }}
          >
            CAST YOUR<br />VOTE
          </h1>
          <p className="font-playfair italic text-[#3d3d5c] text-lg mt-2">
            Choose wisely. Every ballot counts.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { icon: '🟢', label: 'Election Live', pulse: true },
              { icon: '🕐', label: 'Closes Mar 27, 2026' },
              { icon: '🔒', label: 'Secure & Verified' },
              { icon: '🤖', label: 'AI Fraud Detection Active' },
            ].map(chip => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 text-[0.75rem] font-dm text-[#3d3d5c] px-3.5 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.65)', backdropFilter: 'blur(8px)' }}
              >
                {chip.pulse
                  ? <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
                  : chip.icon}{' '}
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {backendCandidates.map(c => {
            const ui = CANDIDATES.find(x => x.id === c.id)

            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`candidate-card text-left ${selected === c.id ? 'selected' : ''}`}
              >
                
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200
                  ${selected === c.id
                    ? 'bg-[#ff6b35] text-white shadow-md'
                    : 'border-2 border-black/10'}`}
                >
                  {selected === c.id ? '✓' : ''}
                </div>

                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4"
                  style={{ background: ui?.color }}
                >
                  {ui?.emoji}
                </div>

                <div className="font-bebas text-[1.55rem] tracking-wide text-[#111010]">
                  {c.name}
                </div>

                <div className="font-dm text-[0.72rem] uppercase tracking-[1.5px] text-[#7a7a9a] mt-0.5">
                  {c.party}
                </div>

                <p className="font-dm text-[0.84rem] text-[#3d3d5c] mt-2.5 leading-relaxed">
                  {ui?.bio}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="fixed bottom-6 left-1/2 z-40 flex items-center justify-between gap-4 px-6 py-4 rounded-2xl"
        style={{
          transform: 'translateX(-50%)',
          minWidth: 'min(90vw, 560px)',
          background: 'rgba(255,255,255,0.32)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.55)',
          boxShadow: '0 8px 32px rgba(160,100,200,0.18)',
        }}
      >
        <p className="font-dm text-[0.88rem] text-[#3d3d5c]">
          {selected
            ? <>Selected: <strong className="text-[#111010]">{selectedCandidate?.name}</strong></>
            : 'Select a candidate to continue'}
        </p>
        <button
          onClick={() => selected && setShowModal(true)}
          className={`btn-dark px-7 py-2.5 rounded-full text-[0.88rem] transition-all duration-200
            ${selected ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}`}
        >
          Cast Vote →
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="animate-modal glass-card rounded-3xl p-10 text-center max-w-sm w-full"
            style={{ boxShadow: '0 32px 80px rgba(160,100,200,0.28)' }}
          >
            <div className="text-5xl mb-4">🗳️</div>
            <h3 className="font-bebas text-[2rem] text-[#111010] mb-1">Confirm Vote</h3>
            <p className="font-dm text-[0.88rem] text-[#3d3d5c] leading-relaxed mb-6">
              You are about to vote for{' '}
              <strong className="text-[#111010]">{selectedCandidate?.name}</strong>.
              <br />This action is <em>irreversible</em>.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowModal(false)}
                disabled={submitting}
                className="font-dm text-[0.88rem] px-6 py-2.5 rounded-full cursor-pointer"
                style={{ background: 'none', border: '1.5px solid rgba(0,0,0,0.1)', color: '#3d3d5c' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-dark px-7 py-2.5 rounded-full text-[0.88rem] disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Confirm →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
