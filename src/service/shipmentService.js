import { shipmentApi } from "../api/shipmentApi"
import { getRequiredAuthorizationHeader } from "./authService"

export const shipmentService = {
    fetchShipments: async () => {
        return await shipmentApi.getAll(getRequiredAuthorizationHeader());
    },
    fetchShipmentByTracking: async (trackingCode) => {
        if (!trackingCode?.trim()) throw new Error("El código de tracking es obligatorio");
        return await shipmentApi.getByTracking(trackingCode.trim(), getRequiredAuthorizationHeader());
    },
    createManualShipment: async ({ orderNumber, destinationAddress, totalUnits }) => {
        if (!orderNumber?.trim() || !destinationAddress?.trim()) {
            throw new Error("El número de orden y la dirección son obligatorios");
        }
        const units = Number(totalUnits) >= 1 ? Number(totalUnits) : 1;
        return await shipmentApi.createManual({
            orderNumber: orderNumber.trim(),
            destinationAddress: destinationAddress.trim(),
            totalUnits: units
        }, getRequiredAuthorizationHeader());
    },
    changeStatus: async (trackingCode, status) => {
        const validStatuses = ["PLANNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];
        if (!validStatuses.includes(status)) throw new Error("Estado no válido");
        return await shipmentApi.updateStatus(trackingCode, status, getRequiredAuthorizationHeader());
    }
};