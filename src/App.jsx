import { useEffect, useState } from 'react'
import './App.css'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import { clearLogin, getSaveToken, getSaveUser } from './service/authService'
import ShipmentsPage from './pages/Shipments'
import OrderPage from './pages/Order'
import InventoryPage from './pages/Inventory'
import PointsPage from './pages/Points'
import PointsBadge from './components/PointsBadge'
import bgAuth from './assets/DiseñoAuth.png'
import bgApp from './assets/DiseñoMicroservicios.png'

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
    // ── LogixPoints: solo ROLE_ADMIN puede acceder a la página de puntos ──
    if (current === "points" && currentUser?.role === "ROLE_ADMIN") return <PointsPage />
    return <h1>Ruta no encontrada</h1>
  }

  function handleLoginSuccess() {
    setIsLogin(true)
    window.location.hash = "#/inventory"
  }

  // --- VISTA PÚBLICA (LOGIN / REGISTRO) ---
  if (!isLogin) {
    return (
      <div style={{
        minHeight: '100vh', width: '100%',
        backgroundImage: `url(${bgAuth})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {showRegister ? 
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />
          </div> : 
          <div style={{ width: '100%', maxWidth: '400px' }}>
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
      </div>
    )
  }

  const isBodeguero = currentUser?.role === "ROLE_WAREHOUSE_MANAGER"
  const isAdmin = currentUser?.role === "ROLE_ADMIN"

  // --- VISTA PRIVADA (PLATAFORMA INTERNA) ---
  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      backgroundImage: `url(${bgApp})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      display: 'flex', justifyContent: 'center'
    }}>
      
      {/* CAJA CENTRADA PRINCIPAL */}
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        maxWidth: '1126px',
        backgroundColor: 'rgba(26, 11, 46, 0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)', 
        boxShadow: '0 0 20px rgba(0,0,0,0.6)'
      }}>

        {/* SIDEBAR */}
        <aside style={{ width: '180px', padding: '20px', borderRight: '1px solid rgba(192, 132, 252, 0.3)', textAlign: 'left' }}>
          <h2 style={{color: '#c084fc', fontSize: '32px', margin: '0 0 10px 0'}}>SmartLogix</h2>
          <p style={{color: '#e5e4e7'}}>Hola, <strong style={{color: '#c084fc'}}>{currentUser?.username}</strong></p>
          <p style={{fontSize: '12px', color: '#a0a0a0', marginBottom: '16px'}}>{currentUser?.role}</p>

          {/* ── LogixPoints: badge de puntos (no se muestra al bodeguero) ── */}
          {!isBodeguero && <PointsBadge />}

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <a href="#/inventory" style={{color: 'white', textDecoration: 'none', fontSize: '22px'}}>Inventario</a>
            
            {!isBodeguero && <a href="#/order" style={{color: 'white', textDecoration: 'none', fontSize: '22px'}}>Pedidos</a>}
            
            <a href="#/shipment" style={{color: 'white', textDecoration: 'none', fontSize: '22px'}}>Envíos</a>

            {/* ── LogixPoints: link solo visible para ROLE_ADMIN ── */}
            {isAdmin && (
              <a
                href="#/points"
                style={{
                  color: current === 'points' ? '#c084fc' : '#d8b4fe',
                  textDecoration: 'none',
                  fontSize: '22px',
                  fontWeight: current === 'points' ? 'bold' : 'normal',
                }}
              >
                Puntos
              </a>
            )}
          </nav>

          <button onClick={() => { clearLogin(); setIsLogin(false) }} style={{ marginTop: '50px', background: '#ff6b6b', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
            Cerrar Sesión
          </button>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <section style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {renderPrivate()}
        </section>
      </div>

    </div>
  )
}

export default App
