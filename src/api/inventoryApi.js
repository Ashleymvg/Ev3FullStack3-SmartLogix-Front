import { httpRequest } from "./httpClient"

// Aquí implementamos TODOS los endpoints que el backend expone, agrupados en un objeto
export const inventoryApi = {
    getAll: (token) => 
        httpRequest("/api/inventory/items", { headers: { Authorization: token } }),
        
    getBySku: (sku, token) => 
        httpRequest(`/api/inventory/items/${sku}`, { headers: { Authorization: token } }),
        
    create: (data, token) => 
        httpRequest("/api/inventory/items", { method: "POST", body: JSON.stringify(data), headers: { Authorization: token } }),
        
    checkStock: (sku, qty, token) => 
        httpRequest(`/api/inventory/items/${sku}/availability?quantity=${qty}`, { headers: { Authorization: token } }),
        
    reserve: (sku, qty, token) => 
        httpRequest(`/api/inventory/items/${sku}/reserve?quantity=${qty}`, { method: "PATCH", headers: { Authorization: token } }),
        
    release: (sku, qty, token) => 
        httpRequest(`/api/inventory/items/${sku}/release?quantity=${qty}`, { method: "PATCH", headers: { Authorization: token } }),
        
    dispatch: (sku, qty, token) => 
        httpRequest(`/api/inventory/items/${sku}/dispatch?quantity=${qty}`, { method: "PATCH", headers: { Authorization: token } })
};