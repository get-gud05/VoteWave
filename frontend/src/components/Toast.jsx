import { useAuth } from '../context/AuthContext'

export default function Toast() {
  const { toast } = useAuth()
  if (!toast) return null

  const bg = toast.type === 'error' ? '#ef4444' : '#111010'

  return (
    <div
      className="animate-toast fixed bottom-8 left-1/2 z-[200] px-6 py-3 rounded-full text-white text-[0.88rem] font-dm font-medium whitespace-nowrap pointer-events-none"
      style={{ transform: 'translateX(-50%)', background: bg, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
    >
      {toast.msg}
    </div>
  )
}
