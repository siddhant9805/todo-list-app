import { createContext, useContext, useEffect, useState } from 'react'
import { api, clearAuth, getAuth, getErrorMessage, saveAuth } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getAuth)

  useEffect(() => {
    const onLogout = () => setAuth({ token: null, email: null })
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  async function login(email, password) {
    try {
      const { data } = await api.post('/login', { email, password })
      saveAuth(data.token, data.email)
      setAuth({ token: data.token, email: data.email })
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Login failed. Please try again.'))
    }
  }

  async function register(email, password) {
    try {
      await api.post('/register', { email, password })
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Registration failed. Please try again.'))
    }
  }

  function logout() {
    clearAuth()
    setAuth({ token: null, email: null })
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}