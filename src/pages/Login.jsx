import { useState } from "react"
import { login, saveLoginSession } from "../service/authService"

function LoginPage({handleLoginSucces}){
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    async function handleSubmit(event) {
        event.preventDefault()
        setMessage("")
        try {
            const response = await login({ credential, password })
            saveLoginSession(response)
            handleLoginSucces()
            setMessage("Login correcto")
        } catch (error) {
            setMessage(error.message)
        }
    }

    return(
        <main style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>
                        Usuario o Correo
                        <input
                            style={styles.input}
                            onChange={(event) => setCredential(event.target.value)}
                            value={credential}
                            placeholder="Ingresa tus credenciales"
                            required
                        />
                    </label>
                    <label style={styles.label}>
                        Contraseña
                        <input
                            style={styles.input}
                            type="password"
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </label>

                    <button style={styles.button} type="submit">
                        Ingresar
                    </button>

                    {message && <p style={styles.message}>{message}</p>}
                </form>
            </div>
        </main>
    )
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' },
    card: { background: '#2d1b4e', padding: '40px 30px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.5)', width: '100%', color: 'white' },
    title: { textAlign: 'center', marginBottom: '25px', color: '#c084fc', fontSize: '28px', margin: '0 0 20px 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    label: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px', color: '#e5e4e7', textAlign: 'left' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #5a3c8a', background: '#1a0b2e', color: 'white', outline: 'none', fontSize: '15px' },
    button: { padding: '12px', borderRadius: '6px', border: 'none', background: '#aa3bff', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '16px' },
    message: { textAlign: 'center', marginTop: '10px', color: '#ff6b6b', fontSize: '14px' }
}

export default LoginPage