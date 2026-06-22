// Nota: Da error con "import React from 'react';""

const PRIVATE_ROUTER = [
  { key: "inventory", label: "Inventario", hash: "#/inventory" },
  { key: "order", label: "Órdenes de Compra", hash: "#/order" },
  { key: "shipment", label: "Envíos", hash: "#/shipment" }
];

export default function DashboardLayout({ children, onLogout }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', textAlign: 'left' }}>
      
      <aside style={{ width: '250px', borderRight: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h2>SmartLogix</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
          {PRIVATE_ROUTER.map((route) => (
            <a key={route.key} href={route.hash} style={{ textDecoration: 'none', color: 'var(--text-h)', fontWeight: '500' }}>
              {route.label}
            </a>
          ))}
        </nav>

        <button 
          onClick={onLogout} 
          style={{ marginTop: 'auto', background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}
        >
          Cerrar Sesión
        </button>
      </aside>

      <section style={{ flex: 1, padding: '32px', backgroundColor: 'var(--code-bg)' }}>
        {children}
      </section>

    </div>
  );
}