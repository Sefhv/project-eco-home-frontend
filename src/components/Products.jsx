import { useState, useEffect } from 'react'
import './Products.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function Products({ token, user, onProductCreated }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', price: '', description: '', stock: '0' })
  const [error, setError] = useState('')

  const fetchProducts = async () => {
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_URL}/api/v1/products`, { headers })
      const data = await response.json()
      if (data.success) setProducts(data.data)
    } catch (err) {
      console.error('Error cargando productos:', err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/v1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          stock: parseInt(formData.stock) || 0,
          available: true
        })
      })

      const data = await response.json()
      if (data.success) {
        setShowForm(false)
        setFormData({ name: '', price: '', description: '', stock: '0' })
        fetchProducts()
        if (onProductCreated) onProductCreated()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Error al crear producto')
    }
  }

  if (loading) return <div className="products-loading">Cargando productos...</div>

  return (
    <div className="products-container">
      <div className="products-header">
        <h3>Catálogo de Productos</h3>
        {user.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : '+ Nuevo Producto'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="product-form" onSubmit={handleCreate}>
          {error && <div className="form-error">{error}</div>}
          <input placeholder="Nombre del producto" value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input placeholder="Precio" type="number" step="0.01" value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <input placeholder="Descripción" value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input placeholder="Stock" type="number" value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})} />
          <button type="submit">Crear Producto</button>
        </form>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-name">{product.name}</div>
            <div className="product-price">${product.price}</div>
            <div className="product-desc">{product.description}</div>
            <div className="product-meta">
              <span>Stock: {product.stock}</span>
              <span className={product.available ? 'available' : 'unavailable'}>
                {product.available ? 'Disponible' : 'Agotado'}
              </span>
            </div>
            {product.creator_name && (
              <div className="product-creator">Creado por: {product.creator_name}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
