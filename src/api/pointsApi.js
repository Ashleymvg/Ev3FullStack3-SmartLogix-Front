import { httpRequest } from './httpClient';

/**
 * API de LogixPoints - programa de fidelización SmartLogix.
 */
export const pointsApi = {
    /**
     * Obtiene el saldo de puntos del usuario autenticado.
     * GET /api/auth/points/me
     */
    getMyPoints: (token) =>
        httpRequest('/api/auth/points/me', { headers: { Authorization: token } }),

    /**
     * Lista todos los usuarios con su saldo de puntos - solo ROLE_ADMIN.
     * GET /api/auth/points/admin/all
     */
    getAllUsersPoints: (token) =>
        httpRequest('/api/auth/points/admin/all', { headers: { Authorization: token } }),

    /**
     * Ajuste manual de puntos - solo ROLE_ADMIN.
     * POST /api/auth/points/admin/adjust
     * Body: { username, points, operation: 'ADD' | 'SUBTRACT' | 'SET' }
     */
    adjustPoints: (body, token) =>
        httpRequest('/api/auth/points/admin/adjust', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { Authorization: token },
        }),
};
