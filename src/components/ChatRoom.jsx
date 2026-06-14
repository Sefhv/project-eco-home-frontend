import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import './ChatRoom.css'

// URL del servidor de chat (Socket.IO)
const CHAT_URL = import.meta.env.VITE_CHAT_URL || 'http://localhost:3001'

function ChatRoom({ token, user, onLogout }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef(null)

  // Scroll automatico al ultimo mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Conexion Socket.IO al servidor de chat (puerto 3001)
  useEffect(() => {
    const newSocket = io(CHAT_URL, {
      auth: { token }
    })

    newSocket.on('connect', () => {
      setConnected(true)
    })

    // Recibir historial (ultimos 10 mensajes)
    newSocket.on('messages', (history) => {
      setMessages(history)
    })

    // Recibir mensaje nuevo en tiempo real
    newSocket.on('new-message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    // Notificaciones de conexion/desconexion
    newSocket.on('user-connected', (data) => {
      setMessages((prev) => [...prev, { id: Date.now(), system: true, text: data.message }])
    })

    newSocket.on('user-disconnected', (data) => {
      setMessages((prev) => [...prev, { id: Date.now(), system: true, text: data.message }])
    })

    // Error de mensaje
    newSocket.on('error-message', (data) => {
      console.error('Error:', data.message)
    })

    // Error de conexion
    newSocket.on('connect_error', (err) => {
      console.error('Error de conexion:', err.message)
      setConnected(false)
      if (err.message.includes('Token') || err.message.includes('Autenticacion')) {
        onLogout()
      }
    })

    newSocket.on('disconnect', () => {
      setConnected(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [token])

  // Enviar mensaje
  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    socket.emit('new-message', { text: newMessage })
    setNewMessage('')
  }

  // Formatear hora (la BD guarda hora local, no convertir zona horaria)
  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    // Extraer hora y minuto directamente del string para evitar conversion UTC
    const match = dateStr.match(/(\d{2}):(\d{2})/)
    if (match) {
      return `${match[1]}:${match[2]}`
    }
    const date = new Date(dateStr)
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <h3>EcoHome Chat Interno</h3>
          <span className="user-info">
            Conectado como: {user.name} ({user.role})
            {connected ? ' - En linea' : ' - Desconectado'}
          </span>
        </div>
        <button onClick={onLogout}>Cerrar sesion</button>
      </div>

      <div className="messages-area">
        {messages.length === 0 && (
          <div className="empty-state">
            No hay mensajes aun. Envia el primero.
          </div>
        )}
        {messages.map((msg) => {
          if (msg.system) {
            return (
              <div key={msg.id} className="message system">
                {msg.text}
              </div>
            )
          }
          const isOwn = msg.user_id === user.id
          return (
            <div key={msg.id} className={`message ${isOwn ? 'own' : 'other'}`}>
              {!isOwn && <div className="msg-username">{msg.username}</div>}
              <div className="msg-text">{msg.text}</div>
              <div className="msg-time">{formatTime(msg.created_at)}</div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={!connected}>Enviar</button>
      </form>
    </div>
  )
}

export default ChatRoom
