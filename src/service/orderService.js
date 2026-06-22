import { orderApi } from "../api/orderApi"
import { getRequiredAuthorizationHeader } from "./authService"

export const orderService = {
    fetchOrders: async () => {
        return await orderApi.getAll(getRequiredAuthorizationHeader());
    },
    fetchOrderByNumber: async (orderNumber) => {
        if (!orderNumber?.trim()) throw new Error("El número de orden es obligatorio");
        return await orderApi.getByNumber(orderNumber.trim(), getRequiredAuthorizationHeader());
    },
    createNewOrder: async ({ customerName, customerEmail, shippingAddress, lines }) => {
        const cleanName = customerName?.trim();
        const cleanEmail = customerEmail?.trim();
        const cleanAddress = shippingAddress?.trim();

        if (!cleanName || !cleanEmail || !cleanAddress) {
            throw new Error("Todos los campos del cliente son obligatorios");
        }

        const validLines = (lines || [])
            .filter(line => line.sku?.trim() && Number(line.quantity) > 0)
            .map(line => ({
                sku: line.sku.trim(),
                quantity: Number(line.quantity),
                unitPrice: Number(line.unitPrice)
            }));

        if (validLines.length === 0) {
            throw new Error("Debe agregar al menos un producto con cantidad válida");
        }

        return await orderApi.create({
            customerName: cleanName,
            customerEmail: cleanEmail,
            shippingAddress: cleanAddress,
            lines: validLines
        }, getRequiredAuthorizationHeader());
    }
};