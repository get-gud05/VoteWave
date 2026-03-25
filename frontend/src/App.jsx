import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import CloudBackground from './components/CloudBackground'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Vote from './pages/Vote'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <CloudBackground />
      <Navbar />
      <Toast />

      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Voter-only */}
        <Route
          path="/vote"
          element={
            <ProtectedRoute requiredRole="voter">
              <Vote />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
