import { httpRequest } from "./httpClient"

export function loginRequest({ credential, password }) {
    return httpRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ credential, password })
    })
}

export function registerRequest({ username, email, password }) {
    return httpRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password })
    })
}