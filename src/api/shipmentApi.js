import { httpRequest } from "./httpClient"

export const shipmentApi = {
    getAll: (token) => 
        httpRequest("/api/shipments", { headers: { Authorization: token } }),
    
    getByTracking: (trackingCode, token) => 
        httpRequest(`/api/shipments/${trackingCode}`, { headers: { Authorization: token } }),
    
    createManual: (shipmentData, token) => 
        httpRequest("/api/shipments", {
            method: "POST",
            body: JSON.stringify(shipmentData),
            headers: { Authorization: token }
        }),
    
    updateStatus: (trackingCode, newStatus, token) => 
        httpRequest(`/api/shipments/${trackingCode}/status?value=${newStatus}`, {
            method: "PATCH",
            headers: { Authorization: token }
        })
};