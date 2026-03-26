import { createContext, useContext, useState, useCallback } from 'react'
import API from "../services/api"

const AuthContext = createContext(null)

const MOCK_USERS = [
  { id: '1', name: 'Admin User',   email: 'admin@votewave.com', password: 'admin123',  role: 'admin',  hasVoted: false },
  { id: '2', name: 'Arjun Rawat',  email: 'arjun@example.com',  password: 'password1', role: 'voter',  hasVoted: false },
  { id: '3', name: 'Meera Joshi',  email: 'meera@example.com',  password: 'password2', role: 'voter',  hasVoted: true  },
]

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)   
  const [toast, setToast]   = useState(null)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }, [])

  

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });

      setUser(res.data);
      return { ok: true, role: res.data.role };

    } catch (err) {
      return { ok: false, error: "Invalid credentials" };
    }
  };

  
  const register = async (name, email, password) => {
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      setUser(res.data);
      return { ok: true };

    } catch (err) {
      return { ok: false, error: "User already exists" };
    }
  };

  
  const logout = useCallback(() => setUser(null), [])

  
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
