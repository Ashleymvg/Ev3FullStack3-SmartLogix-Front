import { getAuthorizationHeader, clearLogin } from "../service/authService";

export const API_URL_BASE = "http://localhost:8080";

export async function httpRequest(path, options = {}) {
    // 1. MIDDLEWARE DE PETICIÓN (Request Interceptor)
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    const authHeader = getAuthorizationHeader();
    if (authHeader) {
        headers["Authorization"] = authHeader;
    }

    try {
        const response = await fetch(`${API_URL_BASE}${path}`, {
            ...options,
            headers
        });

        // 2. MIDDLEWARE DE RESPUESTA (Response Interceptor)
        if (response.status === 401 || response.status === 403) {
            clearLogin();
            window.location.hash = "#/";
            throw new Error("Sesión expirada o acceso no autorizado.");
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok) {
            throw new Error(data?.message || `Error en la solicitud: Código ${response.status}`);
        }

        return data;
    } catch (error) {
        // 3. REGISTRO DE ERRORES (Logging)
        console.error(`[Middleware Error] Falló la petición a ${path}:`, error.message);
        throw error;
    }
}