import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handlesubmit(e) {
        e.preventDefault()
        setError('')

        try {
            await login(email.trim(), password)
            navigate("/", { replace: true })
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back !</h2>
                <p className="auth-subtitle">
                    Login to continue your journey.
                </p>

                <form onSubmit={handlesubmit}>
                    <div className="form-group">
                        <label>Email :</label>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Password :</label>
                        <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-btn">Login</button>
                </form>

                <p className="auth-footer">
                    Don't have an account?
                    <Link to="/register"> Register</Link>
                </p>
            </div>
        </div>
    )
}