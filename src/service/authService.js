import { loginRequest, registerRequest } from "../api/authApi"

// Registra el inicio de sesión enviando los datos limpios al API
export async function login({ credential, password }) {
    const cleanCredential = credential.trim()
    const cleanPassword = password.trim()

    if(!cleanCredential || !cleanPassword){
        throw new Error("Ingrese usuario y password")
    }

    return loginRequest({
        credential: cleanCredential,
        password: cleanPassword
    })
}

// Función para registrar usuarios en el backend
export async function registerUser({ username, email, password }) {
    const cleanUsername = username?.trim()
    const cleanEmail = email?.trim()
    const cleanPassword = password?.trim()

    if(!cleanUsername || !cleanEmail || !cleanPassword) {
        throw new Error("Todos los campos son obligatorios para el registro")
    }
    
    return registerRequest({ 
        username: cleanUsername, 
        email: cleanEmail, 
        password: cleanPassword 
    })
}

// Guarda los datos devueltos por el backend en el almacenamiento local
export function saveLoginSession(loginResponse){
    if(!loginResponse?.token){
        throw new Error("El backend no entrego token")
    }

    localStorage.setItem("token", loginResponse.token)

    localStorage.setItem("user",
        JSON.stringify({
            username: loginResponse.username,
            role: loginResponse.role,
            tokenType: loginResponse.tokenType,
            expiresInMs: loginResponse.expiresInMs
        })
    )
}

export function getSaveToken() {
    return localStorage.getItem("token")
}

export function getSaveUser() {
    try {
        return JSON.parse(localStorage.getItem("user"))
    } catch {
        return null
    }
}

export function getAuthorizationHeader() {
    const token = getSaveToken()
    const user = getSaveUser()

    if(!token){
        return null
    }

    const tokenType = user?.tokenType || "Bearer"
    return `${tokenType} ${token}`
}

export function getRequiredAuthorizationHeader() {
    const authorizationHeader = getAuthorizationHeader()

    if(!authorizationHeader){
        throw new Error("No hay token guardado")
    }

    return authorizationHeader
}

export function clearLogin() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}