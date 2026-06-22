import { useState } from "react"
import { registerUser } from "../service/authService"

function RegisterPage({ onSwitchToLogin }) {
    const [form, setForm] = useState({ username: "", email: "", password: "" })
    const [message, setMessage] = useState("")

    async function handleSubmit(event) {
        event.preventDefault()
        setMessage("Registrando...")
        try {
            await registerUser(form)
            setMessage("¡Registro exitoso! Ahora puedes iniciar sesión.")
            setTimeout(onSwitchToLogin, 2000)
        } catch (error) {
            setMessage(error.message)
        }
    }

    return (
        <main style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Crear cuenta nueva</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input 
                        style={styles.input}
                        placeholder="Usuario" 
                        value={form.username}
                        onChange={(e) => setForm({...form, username: e.target.value})} 
                        required
                    />
                    <input 
                        style={styles.input}
                        placeholder="Correo electrónico" 
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})} 
                        required
                    />
                    <input 
                        style={styles.input}
                        placeholder="Contraseña secreta" 
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})} 
                        required
                    />
                    <button type="submit" style={styles.button}>Registrarse</button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button onClick={onSwitchToLogin} style={styles.linkButton}>
                        ¿Ya tienes cuenta? Inicia sesión
                    </button>
                </div>
            </div>
        </main>
    )
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '80vh' },
    card: { background: '#2d1b4e', padding: '40px 30px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.5)', width: '100%', maxWidth: '400px', color: 'white' },
    title: { textAlign: 'center', marginBottom: '25px', color: '#c084fc', fontSize: '24px', margin: '0 0 20px 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #5a3c8a', background: '#1a0b2e', color: 'white', outline: 'none', fontSize: '15px' },
    button: { padding: '12px', borderRadius: '6px', border: 'none', background: '#aa3bff', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '16px' },
    message: { textAlign: 'center', marginTop: '10px', color: '#ff6b6b', fontSize: '14px' },
    linkButton: { background: 'none', border: 'none', color: '#c084fc', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }
}

export default RegisterPage