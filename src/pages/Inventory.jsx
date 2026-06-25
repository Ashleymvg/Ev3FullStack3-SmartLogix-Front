import { useEffect, useState } from "react";
import { inventoryService } from "../service/inventoryService";

// Imagenes de los productos
import imgTeclado from '../assets/TecladoMecanicoRGB.png';
import imgMouse from '../assets/MouseInalambricoGatito.png';
import imgMonitor from '../assets/Monitor24Pulgadas.png';
import imgGabinete from '../assets/GabineteGamerRGB.png';
import imgPastaT from '../assets/PastaTermica3g.png';
import imgDisco from '../assets/DiscoDuroSSD1TB.png';
import imgMemoria from '../assets/MemoriaRAM16GDDR4.png';
import imgFuente from '../assets/FuentePoder650W.png';
import imgGenerica from '../assets/DiseñoMicroservicios.png';

// Diccionario para enlazar SKU con la imagen 
const productImages = {
    "SKU-1001": imgTeclado,
    "SKU-2001": imgMouse,
    "SKU-3001": imgMonitor,
    "SKU-4001": imgGabinete,
    "SKU-5001": imgPastaT,
    "SKU-6001": imgDisco,
    "SKU-7001": imgMemoria,
    "SKU-8001": imgFuente,
    "SKU-9001": imgGenerica,
};

function InventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionQty, setActionQty] = useState(1);
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        let isMounted = true;
        async function fetchInitialData() {
            try {
                const data = await inventoryService.fetchItems();
                if (isMounted) setInventory(data);
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchInitialData();
        return () => { isMounted = false; };
    }, []);

    async function handleRefresh() {
        setLoading(true);
        setError("");
        try {
            const data = await inventoryService.fetchItems();
            setInventory(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSelectItem(sku) {
        setActionMessage("");
        setActionQty(1);
        try {
            const data = await inventoryService.fetchItemBySku(sku);
            setSelectedItem(data);
        } catch (err) {
            alert("Error al cargar detalles: " + err.message);
        }
    }

    async function handleAction(type) {
        if (!selectedItem) return;
        setActionMessage("Procesando...");
        try {
            if (type === 'reserve') await inventoryService.reserveItem(selectedItem.sku, actionQty);
            if (type === 'release') await inventoryService.releaseItem(selectedItem.sku, actionQty);
            if (type === 'dispatch') await inventoryService.dispatchItem(selectedItem.sku, actionQty);
            
            setActionMessage(`¡Acción '${type}' exitosa!`);
            const newData = await inventoryService.fetchItems();
            setInventory(newData);
            handleSelectItem(selectedItem.sku);
        } catch (err) {
            setActionMessage("Error: " + err.message);
        }
    }

    if (loading && inventory.length === 0) return <h3>Cargando inventario...</h3>;
    if (error) return <h3 style={{color: 'red'}}>Error: {error}</h3>;

    return (
        <main style={{ display: 'flex', gap: '20px', height: '100%' }}>
            <section style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Catálogo de Productos</h2>
                    <button onClick={handleRefresh} style={{ padding: '8px 12px', cursor: 'pointer' }}>🔄 Refrescar</button>
                </div>
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {inventory.map((item) => (
                        <li 
                            key={item.sku} 
                            onClick={() => handleSelectItem(item.sku)}
                            style={{ 
                                padding: '15px', 
                                marginBottom: '10px', 
                                border: '1px solid #eee', 
                                borderRadius: '5px',
                                cursor: 'pointer',
                                backgroundColor: selectedItem?.sku === item.sku ? '#e6f7ff' : '#fff',
                                color: '#3d2b5e'
                            }}
                        >
                            <strong>{item.sku}</strong> - {item.productName}
                            <div style={{ fontSize: '14px', color: '#6b6375', marginTop: '5px' }}>
                                Stock: {item.availableQuantity} | Bodega: {item.warehouseCode}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <section style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa' }}>
                {!selectedItem ? (
                    <div style={{ textAlign: 'center', color: 'gray', marginTop: '50px' }}>
                        <h3>Selecciona un producto de la lista</h3>
                        <p>Para ver sus detalles y realizar operaciones.</p>
                    </div>
                ) : (
                    <div>
                        <h2 style={{ color: '#111111' }}>Detalle del Producto</h2>
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ccc', color: '#3d2b5e', fontSize: '16px', lineHeight: '1.6' }}>

                           {/* Caja para las imagenes */}
                            <div style={{ 
                                textAlign: 'center', 
                                marginBottom: '20px', 
                                width: '100%', 
                                height: '320px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                backgroundColor: '#f8f9fa', 
                                borderRadius: '8px' }}>
                                <img 

                                // Busca la imagen por SKU, si no la encuentra, usa la imgGenerica
                                src={productImages[selectedItem.sku]} 
                                alt={selectedItem.productName} 
                                style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: '100%', 
                                    objectFit: 'contain' 
                                }} 
                            />
                        </div> 

                            <p><strong>SKU:</strong> {selectedItem.sku}</p>
                            <p><strong>Nombre:</strong> {selectedItem.productName}</p>
                            <p><strong>Bodega:</strong> {selectedItem.warehouseCode}</p>
                            <p><strong>Stock Disponible:</strong> <span style={{color: 'green', fontWeight: 'bold'}}>{selectedItem.availableQuantity}</span></p>
                            <p><strong>Stock Reservado:</strong> <span style={{color: 'orange', fontWeight: 'bold'}}>{selectedItem.reservedQuantity}</span></p>
                            <p><strong>Punto de Reorden:</strong> {selectedItem.reorderLevel}</p>
                            <p style={{fontSize: '12px', color: '#a0a0a0', marginTop: '10px'}}>
                                Última actualización: {new Date(selectedItem.updatedAt).toLocaleString()}
                            </p>
                        </div>

                        <h3 style={{ marginTop: '20px', color: '#111111' }}>Operaciones Manuales</h3>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input 
                                type="number" 
                                min="1" 
                                value={actionQty} 
                                onChange={(e) => setActionQty(e.target.value)}
                                style={{ width: '80px', padding: '8px' }}
                            />
                            <button onClick={() => handleAction('reserve')} style={{ background: '#ffc107', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Reservar</button>
                            <button onClick={() => handleAction('release')} style={{ background: '#17a2b8', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Liberar</button>
                            <button onClick={() => handleAction('dispatch')} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Despachar</button>
                        </div>

                        {actionMessage && (
                            <div style={{ marginTop: '15px', padding: '10px', background: '#e9ecef', borderRadius: '5px', color: '#3d2b5e', fontWeight: 'bold' }}>
                                {actionMessage}
                            </div>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default InventoryPage;