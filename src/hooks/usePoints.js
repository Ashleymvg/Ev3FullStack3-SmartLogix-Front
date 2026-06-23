import { useState, useEffect, useCallback } from 'react';
import { pointsService } from '../service/pointsService';

/**
 * Hook para gestionar LogixPoints del usuario autenticado.
 * Carga el saldo al montar y expone un método para refrescar.
 */
export function usePoints() {
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPoints = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await pointsService.getMyPoints();
            setPoints(data?.logixPoints ?? 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPoints();
    }, [fetchPoints]);

    return { points, loading, error, refetch: fetchPoints };
}

/**
 * Hook para el panel de administración de puntos.
 * Solo debe usarse en componentes accesibles por ROLE_ADMIN.
 */
export function useAdminPoints() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adjustLoading, setAdjustLoading] = useState(false);
    const [adjustMessage, setAdjustMessage] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await pointsService.getAllUsersPoints();
            setUsers(data ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const adjust = useCallback(async (username, points, operation) => {
        try {
            setAdjustLoading(true);
            setAdjustMessage(null);
            const result = await pointsService.adjustPoints(username, points, operation);
            setAdjustMessage({ type: 'success', text: `✅ Puntos actualizados: ${result.username} ahora tiene ${result.logixPoints} LogixPoints` });
            await fetchUsers(); // refresca la tabla
        } catch (err) {
            setAdjustMessage({ type: 'error', text: `❌ Error: ${err.message}` });
        } finally {
            setAdjustLoading(false);
        }
    }, [fetchUsers]);

    return { users, loading, error, adjustLoading, adjustMessage, adjust, refetch: fetchUsers };
}
