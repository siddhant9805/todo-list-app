import axios from 'axios'

// Backend URL: Vercel pe VITE_API_URL set karo, warna local server
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export const api = axios.create({ baseURL: API_URL })

export function getAuth() {
    return {
        token: localStorage.getItem('token'),
        email: localStorage.getItem('email'),
    }
}

export function saveAuth(token, email) {
    localStorage.setItem('token', token)
    localStorage.setItem('email', email)
}

export function clearAuth() {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('username') // purana data saaf
}

// Server ka error message nikalne ke liye
export function getErrorMessage(err, fallback) {
    return err.response?.data?.error || fallback
}

// Har request mein token jodo
api.interceptors.request.use((config) => {
    const { token } = getAuth()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Server token reject kare (401/403) to logout
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status
        const url = err.config?.url
        const isAuthCall = url === '/login' || url === '/register'

        if ((status === 401 || status === 403) && !isAuthCall) {
            clearAuth()
            window.dispatchEvent(new Event('auth:logout'))
        }
        return Promise.reject(err)
    }
)