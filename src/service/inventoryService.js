import { inventoryApi } from "../api/inventoryApi"
import { getRequiredAuthorizationHeader } from "./authService"

// Aquí conectamos la API con el token de sesión 
export const inventoryService = {
    fetchItems: async () => {
        return await inventoryApi.getAll(getRequiredAuthorizationHeader());
    },
    fetchItemBySku: async (sku) => {
        return await inventoryApi.getBySku(sku, getRequiredAuthorizationHeader());
    },
    createNewItem: async (payload) => {
        return await inventoryApi.create(payload, getRequiredAuthorizationHeader());
    },
    verifyAvailability: async (sku, quantity) => {
        return await inventoryApi.checkStock(sku, quantity, getRequiredAuthorizationHeader());
    },
    reserveItem: async (sku, quantity) => {
        return await inventoryApi.reserve(sku, quantity, getRequiredAuthorizationHeader());
    },
    releaseItem: async (sku, quantity) => {
        return await inventoryApi.release(sku, quantity, getRequiredAuthorizationHeader());
    },
    dispatchItem: async (sku, quantity) => {
        return await inventoryApi.dispatch(sku, quantity, getRequiredAuthorizationHeader());
    }
};