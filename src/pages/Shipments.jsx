import { useEffect, useState } from "react";
import { shipmentService } from "../service/shipmentService";
import { orderService } from "../service/orderService";

function ShipmentsPage() {
    const [shipments, setShipments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [manualForm, setManualForm] = useState({ orderNumber: "", destinationAddress: "", totalUnits: 1 });
    const [formMessage, setFormMessage] = useState("");
    const [updateStatus, setUpdateStatus] = useState("");

    useEffect(() => {
        let isMounted = true;
        async function fetchInitialData() {
            try {
                const shipmentsData = await shipmentService.fetchShipments();
                const ordersData = await orderService.fetchOrders();
                if (isMounted) { setShipments(shipmentsData); setOrders(ordersData); }
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
            const shipmentsData = await shipmentService.fetchShipments();
            setShipments(shipmentsData);
            const ordersData = await orderService.fetchOrders();
            setOrders(ordersData);
        } catch (err) { console.error("Error recargando datos:", err); }
    }

    async function handleSelectShipment(trackingCode) {
        try {
            const data = await shipmentService.fetchShipmentByTracking(trackingCode);
            setSelectedShipment(data);
            setUpdateStatus(data.status);
        } catch (err) { alert("Error al cargar el envío: " + err.message); }
    }

    async function handleCreateManual(e) {
        e.preventDefault();
        setFormMessage("Creando envío manual...");
        try {
            await shipmentService.createManualShipment(manualForm);
            setFormMessage("¡Envío manual creado e inyectado con éxito!");
            setManualForm({ orderNumber: "", destinationAddress: "", totalUnits: 1 });
            await reloadData();
        } catch (err) { setFormMessage("Error: " + err.message); }
    }

    async function handleUpdateStatus() {
        if (!selectedShipment) return;
        try {
            await shipmentService.changeStatus(selectedShipment.trackingCode, updateStatus);
            alert("¡Estado actualizado en el Microservicio correctamente!");
            await reloadData();
            handleSelectShipment(selectedShipment.trackingCode);
        } catch (err) { alert("Error al actualizar estado: " + err.message); }
    }

    // NUEVA LÓGICA: Calcula las unidades totales automáticamente al seleccionar una orden
    const handleOrderSelection = (e) => {
        const selectedOrderNum = e.target.value;
        if (!selectedOrderNum) {
            setManualForm({ orderNumber: "", destinationAddress: "", totalUnits: 1 });
            return;
        }

        // Buscamos la orden seleccionada en nuestra lista de órdenes cargada
        const orderDetail = orders.find(o => o.orderNumber === selectedOrderNum);
        
        let calcUnits = 1;
        if (orderDetail && orderDetail.lines) {
            calcUnits = orderDetail.lines.reduce((acc, line) => acc + line.quantity, 0);
        }

        setManualForm({
            ...manualForm,
            orderNumber: selectedOrderNum,
            destinationAddress: orderDetail?.shippingAddress || "",
            totalUnits: calcUnits
        });
    };

    if (loading && shipments.length === 0) return <h3>Cargando módulo de envíos y logística...</h3>;
    if (error) return <h3 style={{color: 'red'}}>Error: {error}</h3>;

    return (
        <main style={{ display: 'flex', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
            {/* PANEL IZQUIERDO */}
            <section style={{ flex: '1 1 55%', minWidth: 0, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff' }}>
                    <h2 style={{ color: '#111111', marginTop: 0, marginBottom: '5px' }}>Asignación Manual de Envío</h2>
                    <p style={{ fontSize: '13px', color: 'gray' }}>Ideal para procesar pedidos que quedaron huérfanos o con asignación automática FAILED en el backend.</p>
                    <form onSubmit={handleCreateManual} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                        
                        <select value={manualForm.orderNumber} onChange={handleOrderSelection} required style={{padding: '8px'}}>
                            <option value="">-- Selecciona Pedido --</option>
                            {orders.map(o => (
                                <option key={o.orderNumber} value={o.orderNumber}>{o.orderNumber} ({o.status})</option>
                            ))}
                        </select>
                        
                        <input placeholder="Dirección de Destino" value={manualForm.destinationAddress} onChange={(e) => setManualForm({...manualForm, destinationAddress: e.target.value})} required style={{padding: '8px'}} />
                        
                        {/* EL INPUT DE UNIDADES SE LLENA SOLO, PERO AÚN SE PUEDE EDITAR SI ES NECESARIO */}
                        <input type="number" placeholder="Unidades Totales" min="1" value={manualForm.totalUnits} onChange={(e) => setManualForm({...manualForm, totalUnits: e.target.value})} required style={{padding: '8px'}} />
                        
                        <button type="submit" style={{ backgroundColor: '#28a745', color: '#fff', cursor: 'pointer', border: 'none', padding: '10px', borderRadius: '4px' }}>Asignar e Iniciar Ruta</button>
                    </form>
                    {formMessage && <p style={{ fontWeight: 'bold', marginTop: '10px', color: '#28a745' }}>{formMessage}</p>}
                </div>

                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff' }}>
                    <h2 style={{ color: '#111111', marginTop: 0, marginBottom: '15px' }}>Envíos Planificados por Fábrica</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {shipments.map(s => (
                            <li key={s.trackingCode} onClick={() => handleSelectShipment(s.trackingCode)} style={{ padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedShipment?.trackingCode === s.trackingCode ? '#e6f7ff' : 'transparent', color: '#3d2b5e' }}>
                                <strong>{s.trackingCode}</strong> - Orden: {s.orderNumber}
                                <span style={{ float: 'right', fontWeight: 'bold', color: '#007bff' }}>{s.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* PANEL DERECHO */}
            <section style={{ flex: '1 1 45%', minWidth: 0, boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa', textAlign: 'left' }}>
                {!selectedShipment ? (
                    <div style={{ textAlign: 'center', color: 'gray', marginTop: '100px' }}>
                        <h3>Selecciona un envío</h3>
                        <p>Para inspeccionar la ruta, la fecha estimada calculada por estrategia (Factory Pattern) en el backend y simular cambios de estado.</p>
                    </div>
                ) : (
                    <div>
                        <h2 style={{ color: '#111111', marginTop: 0, marginBottom: '20px' }}>Hoja de Ruta y Logística</h2>
                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6', color: '#3d2b5e', fontSize: '16px' }}>
                            <p><strong>Código Tracking:</strong> {selectedShipment.trackingCode}</p>
                            <p><strong>Pedido Origen:</strong> {selectedShipment.orderNumber}</p>
                            <p><strong>Transportista Asignado:</strong> <span style={{ color: '#6f42c1', fontWeight: 'bold' }}>{selectedShipment.carrier}</span></p>
                            <p><strong>Código Ruta Logística:</strong> {selectedShipment.routeCode}</p>
                            <p><strong>Fecha Estimada Entrega:</strong> {new Date(selectedShipment.estimatedDeliveryDate).toLocaleDateString()}</p>
                            <p><strong>Estado Logístico:</strong> <span style={{ color: '#007bff', fontWeight: 'bold' }}>{selectedShipment.status}</span></p>
                        </div>

                        <h3 style={{ marginTop: '30px', color: '#111111' }}>⚙️ Modificar Estado (Simular Operación)</h3>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)} style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}>
                                <option value="PLANNED">Planificado (PLANNED)</option>
                                <option value="PICKED_UP">Retirado de Bodega (PICKED_UP)</option>
                                <option value="IN_TRANSIT">En Tránsito (IN_TRANSIT)</option>
                                <option value="DELIVERED">Entregado al Cliente (DELIVERED)</option>
                            </select>
                            <button onClick={handleUpdateStatus} style={{ backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>Aplicar</button>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}

export default ShipmentsPage;