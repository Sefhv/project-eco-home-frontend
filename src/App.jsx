import { useState } from 'react'
import Login from './components/Login'
import ChatRoom from './components/ChatRoom'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const handleLogin = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  if (!token || !user) {
    return <Login onLogin={handleLogin} />
  }

  return <ChatRoom token={token} user={user} onLogout={handleLogout} />
}

export default App
