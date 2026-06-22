import { useState, useEffect } from 'react'
import Login from './components/Login'
import ChatRoom from './components/ChatRoom'
import Products from './components/Products'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [view, setView] = useState('products')
  const [userDisplay, setUserDisplay] = useState('')

  const loadStats = async () => {
    if (!token) return
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/me/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setUserDisplay(data.data.display)
      }
    } catch (err) {
      setUserDisplay(user?.name || '')
    }
  }

  useEffect(() => {
    if (token && user) loadStats()
  }, [token])

  const handleLogin = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setUserDisplay('')
  }

  if (!token || !user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app-container">
      <nav className="app-nav">
        <div className="nav-left">
          <span className="nav-brand">🌿 EcoHome Store</span>
          <button className={view === 'products' ? 'active' : ''} onClick={() => setView('products')}>
            Catálogo
          </button>
          <button className={view === 'chat' ? 'active' : ''} onClick={() => setView('chat')}>
            Chat
          </button>
        </div>
        <div className="nav-right">
          <span className="user-display">{userDisplay || user.name}</span>
          <button onClick={handleLogout} className="logout-btn">Salir</button>
        </div>
      </nav>

      <div className="app-content">
        {view === 'products' && (
          <Products token={token} user={user} onProductCreated={loadStats} />
        )}
        {view === 'chat' && (
          <ChatRoom token={token} user={user} onLogout={handleLogout} />
        )}
      </div>
    </div>
  )
}

export default App
