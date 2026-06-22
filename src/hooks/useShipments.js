import { useState, useEffect } from 'react';
import { getShipment, updateShipmentStatus } from '../service/shipmentService';

export function useShipments() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchShipments = async () => {
        setLoading(true);
        try {
            const data = await getShipment();
            setShipments(data || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (trackingCode, status) => {
        if (!status) return; // Evita llamadas vacías
        setLoading(true);
        try {
            await updateShipmentStatus(trackingCode, status);
            await fetchShipments();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchShipments();
        };
        load();
    }, []);

    return { shipments, loading, error, updateStatus, fetchShipments };
}