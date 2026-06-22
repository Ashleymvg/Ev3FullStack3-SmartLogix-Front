import { useEffect, useState } from 'react'
import './App.css'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import { clearLogin, getSaveToken, getSaveUser } from './service/authService'
import ShipmentsPage from './pages/Shipments'
import OrderPage from './pages/Order'
import InventoryPage from './pages/Inventory'

function getRouterFromHash() {
  return window.location.hash.replace("#/", "") || "inventory" 
}

function App() {
  const [isLogin, setIsLogin] = useState(Boolean(getSaveToken()))
  const [showRegister, setShowRegister] = useState(false)
  const [current, setCurrent] = useState(getRouterFromHash())
  
  const currentUser = getSaveUser()

  useEffect(() => {
    function handleHashChange() {
      setCurrent(getRouterFromHash())
    }
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  function renderPrivate() {
    if (current === "shipment") return <ShipmentsPage />
    if (current === "order") return <OrderPage />
    if (current === "inventory") return <InventoryPage />
    return <h1>Ruta no encontrada</h1>
  }

  function handleLoginSuccess() {
    setIsLogin(true)
    window.location.hash = "#/inventory"
  }

  if (!isLogin) {
    return showRegister ? 
      <RegisterPage onSwitchToLogin={() => setShowRegister(false)} /> : 
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '15vh'}}>
        <LoginPage handleLoginSucces={handleLoginSuccess} />
        <button 
          onClick={() => setShowRegister(true)} 
          style={{ 
            marginTop: '20px', width: '100%', background: 'none', border: 'none', 
            color: '#c084fc', textDecoration: 'underline', cursor: 'pointer', fontSize: '15px' 
          }}
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
  }

  const isBodeguero = currentUser?.role === "ROLE_WAREHOUSE_MANAGER"

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', padding: '20px', borderRight: '1px solid #3d2b5e', textAlign: 'left' }}>
        <h2 style={{color: '#c084fc', fontSize: '32px', margin: '0 0 10px 0'}}>SmartLogix</h2>
        <p style={{color: '#e5e4e7'}}>Hola, <strong style={{color: '#c084fc'}}>{currentUser?.username}</strong></p>
        <p style={{fontSize: '12px', color: '#a0a0a0', marginBottom: '30px'}}>{currentUser?.role}</p>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <a href="#/inventory" style={{color: 'white', textDecoration: 'none', fontSize: '22px'}}>Inventario</a>
          
          {!isBodeguero && <a href="#/order" style={{color: 'white', textDecoration: 'none', fontSize: '22px'}}>Pedidos</a>}
          
          <a href="#/shipment" style={{color: 'white', textDecoration: 'none', fontSize: '22px'}}>Envíos</a>
        </nav>

        <button onClick={() => { clearLogin(); setIsLogin(false) }} style={{ marginTop: '50px', background: '#ff6b6b', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
          Cerrar Sesión
        </button>
      </aside>

      <section style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {renderPrivate()}
      </section>
    </div>
  )
}

export default App