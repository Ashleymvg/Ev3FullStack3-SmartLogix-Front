import { pointsApi } from '../api/pointsApi';
import { getRequiredAuthorizationHeader } from './authService';

/**
 * Servicio de LogixPoints - programa de fidelización SmartLogix.
 */
export const pointsService = {
    /**
     * Obtiene el saldo de puntos del usuario autenticado.
     */
    getMyPoints: async () => {
        return await pointsApi.getMyPoints(getRequiredAuthorizationHeader());
    },

    /**
     * Obtiene todos los usuarios con su saldo de puntos - solo ROLE_ADMIN.
     */
    getAllUsersPoints: async () => {
        return await pointsApi.getAllUsersPoints(getRequiredAuthorizationHeader());
    },

    /**
     * Ajusta manualmente los puntos de un usuario - solo ROLE_ADMIN.
     * @param {string} username
     * @param {number} points
     * @param {'ADD'|'SUBTRACT'|'SET'} operation
     */
    adjustPoints: async (username, points, operation) => {
        if (!username?.trim()) throw new Error('El nombre de usuario es obligatorio');
        if (isNaN(points) || points < 0) throw new Error('Los puntos deben ser un número positivo');
        if (!['ADD', 'SUBTRACT', 'SET'].includes(operation)) {
            throw new Error('Operación inválida. Use ADD, SUBTRACT o SET');
        }

        return await pointsApi.adjustPoints(
            { username: username.trim(), points: Number(points), operation },
            getRequiredAuthorizationHeader()
        );
    },
};
