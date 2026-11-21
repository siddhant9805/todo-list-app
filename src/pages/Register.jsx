import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export function Register() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmpassword] = useState('')
    const [error, setError] = useState('')
    const { register, login } = useAuth()
    const navigate = useNavigate()

    async function handlesubmit(e) {
        e.preventDefault()
        setError('')

        if (password !== confirmpassword) {
            setError('Passwords do not match')
            return
        }

        try {
            await register(email.trim(), password)
            await login(email.trim(), password)   // register ke baad seedha login
            navigate("/", { replace: true })
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Register to continue your journey.</p>

                <form onSubmit={handlesubmit}>
                    <div className="form-group">
                        <label>Email :</label>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Password :</label>
                        <input type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password :</label>
                        <input type="password" placeholder="Confirm Password" value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} required />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-btn">Register</button>
                </form>

                <p className="auth-footer">
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </p>
            </div>
        </div>
    )
}