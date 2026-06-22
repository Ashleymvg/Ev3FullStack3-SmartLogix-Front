import { httpRequest } from "./httpClient"

export const orderApi = {
    getAll: (token) => 
        httpRequest("/api/orders", { headers: { Authorization: token } }),
    
    getByNumber: (orderNumber, token) => 
        httpRequest(`/api/orders/${orderNumber}`, { headers: { Authorization: token } }),
    
    create: (orderData, token) => 
        httpRequest("/api/orders", {
            method: "POST",
            body: JSON.stringify(orderData),
            headers: { Authorization: token }
        })
};