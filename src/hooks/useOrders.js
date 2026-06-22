import { useState, useEffect } from 'react';
import { getOrders, createOrder } from '../service/orderService';

export function useOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addOrder = async (newOrder) => {
        setLoading(true);
        try {
            await createOrder(newOrder);
            await fetchOrders(); // Recargar la tabla tras crear la orden
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    const loadData = async () => {
      await fetchOrders();
    };
    loadData();
  }, []);

    return { orders, loading, error, addOrder, fetchOrders };
}