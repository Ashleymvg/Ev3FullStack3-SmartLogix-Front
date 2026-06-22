// Nota: da error con "import React, { useState } from 'react';"
import { useState } from 'react';

export default function InventoryForm({ onSubmit, loading }) {
    const [formData, setFormData] = useState({ name: '', quantity: 0, price: 0 });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: '', quantity: 0, price: 0 }); // Limpiar formulario
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '8px', color: '#333' }}>
            <h3>Agregar Nuevo Producto</h3>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Nombre del producto" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Cantidad" 
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Precio" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    required 
                />
                <button type="submit" disabled={loading} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>
                    {loading ? 'Guardando...' : 'Crear Item'}
                </button>
            </div>
        </form>
    );
}