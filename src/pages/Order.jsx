import { useEffect, useState } from "react";
import { orderService } from "../service/orderService";
import { inventoryService } from "../service/inventoryService";
import { usePoints } from "../hooks/usePoints";

function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [form, setForm] = useState({
        customerName: "", customerEmail: "", shippingAddress: "", lines: [{ sku: "", quantity: 1, unitPrice: 0 }]
    });
    const [message, setMessage] = useState("");

    // ── LogixPoints ──────────────────────────────────────────────
    const { points: myPoints, loading: pointsLoading, refetch: refetchPoints } = usePoints();
    const [useLogixPoints, setUseLogixPoints] = useState(false);  // nombre cambiado para evitar conflicto

    const formTotal = form.lines.reduce((acc, l) => acc + (Number(l.unitPrice) * Number(l.quantity || 1)), 0);
    const pointsDiscount = useLogixPoints ? Math.min(myPoints, formTotal) : 0;
    const finalTotal = Math.max(0, formTotal - pointsDiscount);
    // ─────────────────────────────────────────────────────────────

    useEffect(() => {
        let isMounted = true;
        async function fetchInitialData() {
            try {
                const ordersData = await orderService.fetchOrders();
                const invData = await inventoryService.fetchItems();
                if (isMounted) { setOrders(ordersData); setInventory(invData); }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchInitialData();
        return () => { isMounted = false; };
    }, []);

    async function reloadData() {
        try {
            const ordersData = await orderService.fetchOrders();
            setOrders(ordersData);
            const invData = await inventoryService.fetchItems();
            setInventory(invData);
        } catch (err) { console.error("Error recargando los datos:", err); }
    }

    async function handleSelectOrder(orderNumber) {
        try {
            const data = await orderService.fetchOrderByNumber(orderNumber);
            setSelectedOrder(data);
        } catch (err) { alert("Error al cargar detalle: " + err.message); }
    }

    function handleLineChange(index, field, value) {
        const newLines = form.lines.map((line, i) => {
            if (i === index) {
                if (field === "sku") {
                    const selectedProduct = inventory.find(item => item.sku === value);
                    return { 
                        ...line, 
                        sku: value, 
                        unitPrice: selectedProduct ? selectedProduct.price : 0 
                    };
                }
                return { ...line, [field]: value };
            }
            return line;
        });
        setForm({ ...form, lines: newLines });
    }

    function addLine() { setForm({ ...form, lines: [...form.lines, { sku: "", quantity: 1, unitPrice: 0 }] }); }
    function removeLine(index) { setForm({ ...form, lines: form.lines.filter((_, i) => i !== index) }); }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("Creando pedido y verificando stock con el almacén...");
        try {
            const response = await orderService.createNewOrder({
                ...form,
                usePoints: useLogixPoints && myPoints > 0,
                pointsToUse: useLogixPoints ? Math.min(myPoints, formTotal) : 0,
            });

            let successMsg = "¡Pedido enviado correctamente al sistema!";
            if (response?.pointsRedeemed > 0) {
                successMsg += ` Se descontaron ${response.pointsRedeemed.toLocaleString('es-CL')} LogixPoints.`;
            }
            if (response?.pointsEarned > 0) {
                successMsg += ` Ganaste ${response.pointsEarned.toLocaleString('es-CL')} LogixPoints nuevos.`;
            }
            setMessage(successMsg);
            setUseLogixPoints(false);
            setForm({ customerName: "", customerEmail: "", shippingAddress: "", lines: [{ sku: "", quantity: 1, unitPrice: 0 }] });
            await reloadData();
            await refetchPoints();
            if (response && response.orderNumber) handleSelectOrder(response.orderNumber);
        } catch (err) { setMessage("Error: " + err.message); }
    }

    if (loading && orders.length === 0) return <h3>Cargando módulo de pedidos...</h3>;
    if (error) return <h3 style={{color: 'red'}}>Error: {error}</h3>;

    return (
        <main style={{ display: 'flex', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
            {/* PANEL IZQUIERDO */}
            <section style={{ flex: '1 1 45%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', textAlign: 'left' }}>
                    <h2 style={{ color: '#111111', marginTop: 0, marginBottom: '15px' }}>Crear Nuevo Pedido</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input placeholder="Nombre del Cliente" value={form.customerName} onChange={(e) => setForm({...form, customerName: e.target.value})} required style={{ padding: '8px' }} />
                        <input placeholder="Email del Cliente" type="email" value={form.customerEmail} onChange={(e) => setForm({...form, customerEmail: e.target.value})} required style={{ padding: '8px' }} />
                        <input placeholder="Dirección de Envío" value={form.shippingAddress} onChange={(e) => setForm({...form, shippingAddress: e.target.value})} required style={{ padding: '8px' }} />
                        
                        <h2 style={{ color: '#111111', marginTop: '10px', marginBottom: '10px' }}>Productos a solicitar</h2>
                        {form.lines.map((line, index) => (
                            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                                <select value={line.sku} onChange={(e) => handleLineChange(index, "sku", e.target.value)} required style={{ flex: 2, padding: '8px', minWidth: 0 }}>
                                    <option value="">-- Seleccione Producto --</option>
                                    {inventory.map(item => (
                                        <option key={item.sku} value={item.sku}>{item.sku} - {item.productName} (Disp: {item.availableQuantity})</option>
                                    ))}
                                </select>
                                <input type="number" placeholder="Cant" min="1" value={line.quantity} onChange={(e) => handleLineChange(index, "quantity", e.target.value)} style={{ width: '60px', padding: '8px' }} required />
                                <input type="text" placeholder="Precio" value={line.unitPrice ? `$${Number(line.unitPrice).toLocaleString()}` : ""} readOnly style={{ width: '100px', padding: '8px', backgroundColor: '#e9ecef', color: '#495057', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'not-allowed', fontWeight: 'bold'}} required />
                                <button type="button" onClick={() => removeLine(index)} disabled={form.lines.length === 1} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                            </div>
                        ))}

                        {/* ── LogixPoints: checkbox de canje ────────────────── */}
                        {myPoints > 0 && formTotal > 0 && (
                            <div style={{
                                marginTop: '8px',
                                padding: '12px',
                                background: 'linear-gradient(135deg, #f5f0ff, #ede9fe)',
                                border: '1px solid #c084fc',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                            }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', color: '#6d28d9' }}>
                                    <input
                                        type="checkbox"
                                        checked={useLogixPoints}
                                        onChange={(e) => setUseLogixPoints(e.target.checked)}
                                        style={{ width: '16px', height: '16px', accentColor: '#7c3aed' }}
                                    />
                                    Usar mis {pointsLoading ? '...' : myPoints.toLocaleString('es-CL')} LogixPoints para descontar ${pointsLoading ? '...' : Math.min(myPoints, formTotal).toLocaleString('es-CL')}
                                </label>
                                {useLogixPoints && (
                                    <div style={{ fontSize: '13px', color: '#7c3aed', paddingLeft: '24px' }}>
                                        <span>Subtotal: </span>
                                        <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>${formTotal.toLocaleString('es-CL')}</span>
                                        <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>→ Total final: ${finalTotal.toLocaleString('es-CL')}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* ─────────────────────────────────────────────────── */}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="button" onClick={addLine} style={{ backgroundColor: '#6c757d', color: '#fff', cursor: 'pointer', border: 'none', padding: '10px 15px', borderRadius: '4px' }}>+ Añadir Producto</button>
                            <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', border: 'none', padding: '10px 15px', borderRadius: '4px' }}>Generar Orden</button>
                        </div>
                    </form>
                    {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#007bff' }}>{message}</p>}
                </div>

                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', textAlign: 'left' }}>
                    <h2 style={{ color: '#111111', marginTop: 0, marginBottom: '15px' }}>Historial de Pedidos</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {orders.map(o => (
                            <li key={o.orderNumber} onClick={() => handleSelectOrder(o.orderNumber)} style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedOrder?.orderNumber === o.orderNumber ? '#e6f7ff' : 'transparent', color: '#3d2b5e' }}>
                                <strong>{o.orderNumber}</strong> - {o.totalAmount ? `$${Number(o.totalAmount).toLocaleString()}` : 'Calculando...'}
                                <span style={{ 
                                    float: 'right', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', 
                                    background: o.status === 'SHIPMENT_REQUESTED' || o.status === 'APPROVED' ? '#d4edda' : '#fff3cd', 
                                    color: o.status === 'SHIPMENT_REQUESTED' || o.status === 'APPROVED' ? '#155724' : '#856404' 
                                }}>
                                    {o.status === 'FAILED' ? 'PENDIENTE LOGÍSTICA' : o.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* PANEL DERECHO */}
            <section style={{ flex: '1 1 55%', minWidth: 0, border: '1px solid #ddd', borderRadius: '8px', padding: '25px', backgroundColor: '#fafafa', textAlign: 'left', boxSizing: 'border-box' }}>
                {!selectedOrder ? (
                    <div style={{ textAlign: 'center', marginTop: '100px' }}>
                        <h3 style={{ color: '#3d2b5e' }}>Selecciona un pedido</h3>
                        <p style={{ color: '#3d2b5e' }}>Para ver el desglose completo de ítems, estado de orquestación y el tracking asignado por el backend.</p>
                    </div>
                ) : (
                    <div>
                        <h2 style={{ color: '#111111', marginTop: 0, textAlign: 'center', marginBottom: '20px' }}>Desglose de la Orden</h2>
                        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #eee', lineHeight: '1.8', fontSize: '16px', color: '#3d2b5e', boxSizing: 'border-box' }}>
                            <p><strong>N° Orden:</strong> {selectedOrder.orderNumber}</p>
                            <p><strong>Estado:</strong> 
                                <span style={{ fontWeight: 'bold', marginLeft: '5px', color: selectedOrder.status === 'FAILED' ? '#f0ad4e' : '#007bff' }}>
                                    {selectedOrder.status === 'FAILED' ? 'PENDIENTE' : selectedOrder.status}
                                </span>
                            </p>
                            <p><strong>Total Facturado:</strong> ${Number(selectedOrder.totalAmount || 0).toLocaleString()}</p>

                            {selectedOrder.pointsRedeemed > 0 && (
                                <p style={{ color: '#7c3aed', fontWeight: '600' }}>
                                    LogixPoints usados: -{selectedOrder.pointsRedeemed.toLocaleString('es-CL')} pts (descuento ${selectedOrder.pointsRedeemed.toLocaleString('es-CL')})
                                </p>
                            )}
                            {selectedOrder.pointsEarned > 0 && (
                                <p style={{ color: '#059669', fontWeight: '600' }}>
                                    🎁 LogixPoints ganados: +{selectedOrder.pointsEarned.toLocaleString('es-CL')} pts
                                </p>
                            )}
                            
                            <p><strong>Código de Tracking:</strong> 
                                {selectedOrder.trackingCode ? (
                                    <span style={{color: 'green', fontWeight: 'bold', marginLeft: '5px'}}>{selectedOrder.trackingCode}</span>
                                ) : (
                                    <span style={{color: '#856404', fontWeight: '500', marginLeft: '5px'}}>Esperando asignación...</span>
                                )}
                            </p>

                            {selectedOrder.status === 'FAILED' && (
                                <div style={{ color: '#856404', background: '#fff3cd', border: '1px solid #ffeeba', padding: '15px', borderRadius: '6px', marginTop: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                                    💡 <strong>Flujo de Excepción Logística:</strong> El pedido fue aprobado y los artículos ya están reservados en el inventario. Sin embargo, el transportista automático no está respondiendo. Este caso requiere que vayas al módulo de <strong>Envíos</strong> para realizar una <strong>Asignación Manual</strong>.
                                </div>
                            )}

                            <p style={{ fontSize: '13px', color: 'gray', marginTop: '20px' }}>Fecha Registro: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>

                        <h3 style={{ marginTop: '25px', color: '#111111' }}>Productos Solicitados</h3>
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', color: '#3d2b5e' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>SKU</th>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Cant</th>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Precio Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.lines?.map((l, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '10px' }}>{l.sku}</td>
                                            <td style={{ padding: '10px' }}>{l.quantity}</td>
                                            <td style={{ padding: '10px' }}>${Number(l.unitPrice).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}

export default OrderPage;
