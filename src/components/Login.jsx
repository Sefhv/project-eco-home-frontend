import { useState } from 'react'
import './Login.css'

// URL del backend API (auth)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        onLogin(data.data.token, data.data.user)
      } else {
        setError(data.message || 'Credenciales invalidas.')
      }
    } catch (err) {
      setError('Error de conexion con el servidor.')
    }
    setLoading(false)
  }

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>EcoHome Chat</h2>
        <p>Chat interno corporativo - Ingresa con tu cuenta</p>
        {error && <div className="login-error">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar al Chat'}
        </button>
      </form>
    </div>
  )
}

export default Login
