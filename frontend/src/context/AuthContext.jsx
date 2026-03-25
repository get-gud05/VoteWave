import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

// Mock users — replace with real API calls later
const MOCK_USERS = [
  { id: '1', name: 'Admin User',   email: 'admin@votewave.com', password: 'admin123',  role: 'admin',  hasVoted: false },
  { id: '2', name: 'Arjun Rawat',  email: 'arjun@example.com',  password: 'password1', role: 'voter',  hasVoted: false },
  { id: '3', name: 'Meera Joshi',  email: 'meera@example.com',  password: 'password2', role: 'voter',  hasVoted: true  },
]

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)   // null = logged out
  const [toast, setToast]   = useState(null)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }, [])

  // ── Login ──────────────────────────────────────────
  const login = useCallback((email, password) => {
    const found = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { ok: false, error: 'Invalid email or password.' }
    setUser({ ...found })
    return { ok: true, role: found.role }
  }, [])

  // ── Register ───────────────────────────────────────
  const register = useCallback((name, email, password) => {
    const exists = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (exists) return { ok: false, error: 'An account with this email already exists.' }
    const newUser = { id: Date.now().toString(), name, email, password, role: 'voter', hasVoted: false }
    MOCK_USERS.push(newUser)
    setUser({ ...newUser })
    return { ok: true }
  }, [])

  // ── Logout ─────────────────────────────────────────
  const logout = useCallback(() => setUser(null), [])

  // ── Mark voted ────────────────────────────────────
  const markVoted = useCallback(() => {
    setUser(prev => ({ ...prev, hasVoted: true }))
    const u = MOCK_USERS.find(u => u.id === user?.id)
    if (u) u.hasVoted = true
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, markVoted, toast, showToast }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
