import { useState } from 'react';

export default function OrderForm({ onSubmit, loading }) {
    // Estructura exacta que espera el backend (CreateOrderRequest)
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        shippingAddress: '',
        sku: '',
        quantity: 1,
        price: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Armamos el payload tal cual lo pide la API de Spring Boot
        const orderPayload = {
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            shippingAddress: formData.shippingAddress,
            lines: [
                {
                    sku: formData.sku,
                    quantity: parseInt(formData.quantity),
                    unitPrice: parseFloat(formData.price)
                }
            ]
        };

        onSubmit(orderPayload);
        
        // Limpiamos el formulario
        setFormData({ customerName: '', customerEmail: '', shippingAddress: '', sku: '', quantity: 1, price: 0 });
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '8px', color: '#333' }}>
            <h3>Generar Orden de Compra</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                <input type="text" placeholder="Nombre (Ej: Ana)" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} required />
                <input type="email" placeholder="Email" value={formData.customerEmail} onChange={(e) => setFormData({...formData, customerEmail: e.target.value})} required />
                <input type="text" placeholder="Dirección" value={formData.shippingAddress} onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})} required />
                <input type="text" placeholder="SKU Producto (Ej: SKU-1001)" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required />
                <input type="number" placeholder="Cantidad" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} required min="1" />
                <input type="number" placeholder="Precio Unitario" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} required />
                
                <button type="submit" disabled={loading} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                    {loading ? 'Generando...' : 'Crear Orden'}
                </button>
            </div>
        </form>
    );
}