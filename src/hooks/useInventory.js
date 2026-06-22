import { useState, useEffect } from 'react';
import { getInventory, createInventoryItem } from '../service/inventoryService';

export function useInventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const data = await getInventory();
            setItems(data || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (newItem) => {
        setLoading(true);
        try {
            await createInventoryItem(newItem);
            await fetchInventory(); // Recargar la tabla después de crear
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    const loadData = async () => {
      await fetchInventory();
    };
    loadData();
  }, []);

    return { items, loading, error, addItem, fetchInventory };
}