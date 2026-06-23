import { useState } from 'react';
import { useAdminPoints } from '../hooks/usePoints';

/**
 * Página de administración del Programa de Fidelización LogixPoints.
 * Solo visible para usuarios con ROLE_ADMIN.
 *
 * Funcionalidades:
 *  - Ver el saldo de puntos de todos los usuarios
 *  - Ajustar puntos manualmente (ADD / SUBTRACT / SET)
 */
export default function PointsPage() {
    const { users, loading, error, adjustLoading, adjustMessage, adjust, refetch } = useAdminPoints();

    const [form, setForm] = useState({
        username: '',
        points: '',
        operation: 'ADD',
    });

    function handleFormChange(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleAdjust(e) {
        e.preventDefault();
        await adjust(form.username, Number(form.points), form.operation);
        setForm({ username: '', points: '', operation: 'ADD' });
    }

    function fillForm(username) {
        setForm(prev => ({ ...prev, username }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Totales del panel
    const totalPoints = users.reduce((acc, u) => acc + u.logixPoints, 0);
    const usersWithPoints = users.filter(u => u.logixPoints > 0).length;

    return (
        <main style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>

            {/* ── ENCABEZADO ───────────────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                borderRadius: '12px',
                padding: '24px',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '26px' }}>LogixPoints - Panel Admin</h1>
                    <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '14px' }}>
                        Programa de Fidelización • 1% del total de compra en puntos • 1 punto = $1 de descuento
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalPoints.toLocaleString('es-CL')}</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Puntos en circulación</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{usersWithPoints}</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Usuarios con puntos</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{users.length}</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Total usuarios</div>
                    </div>
                </div>
            </div>

            {/* ── AJUSTE MANUAL ────────────────────────────────────────── */}
            <div style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '20px',
            }}>
                <h2 style={{ marginTop: 0, color: '#111', fontSize: '18px' }}>Ajuste Manual de Puntos</h2>

                <form onSubmit={handleAdjust} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px', flex: '1' }}>
                        <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>USERNAME</label>
                        <input
                            type="text"
                            placeholder="Ej: usuario"
                            value={form.username}
                            onChange={(e) => handleFormChange('username', e.target.value)}
                            required
                            style={{ padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px', flex: '0.5' }}>
                        <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>PUNTOS</label>
                        <input
                            type="number"
                            placeholder="Ej: 500"
                            value={form.points}
                            onChange={(e) => handleFormChange('points', e.target.value)}
                            required
                            min="0"
                            style={{ padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>OPERACIÓN</label>
                        <select
                            value={form.operation}
                            onChange={(e) => handleFormChange('operation', e.target.value)}
                            style={{ padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: '#fff' }}
                        >
                            <option value="ADD">➕ Sumar</option>
                            <option value="SUBTRACT">➖ Restar</option>
                            <option value="SET">🔧 Establecer</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={adjustLoading}
                        style={{
                            padding: '9px 20px',
                            background: adjustLoading ? '#9ca3af' : '#7c3aed',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: adjustLoading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {adjustLoading ? 'Guardando...' : 'Aplicar'}
                    </button>
                </form>

                {adjustMessage && (
                    <div style={{
                        marginTop: '12px',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: adjustMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                        color: adjustMessage.type === 'success' ? '#065f46' : '#991b1b',
                        border: `1px solid ${adjustMessage.type === 'success' ? '#a7f3d0' : '#fca5a5'}`,
                    }}>
                        {adjustMessage.text}
                    </div>
                )}
            </div>

            {/* ── TABLA DE USUARIOS ────────────────────────────────────── */}
            <div style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '20px',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ margin: 0, color: '#111', fontSize: '18px' }}>Saldo de Usuarios</h2>
                    <button
                        onClick={refetch}
                        style={{ padding: '6px 14px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                    >
                        🔄 Actualizar
                    </button>
                </div>

                {loading && <p style={{ color: '#6b7280' }}>Cargando usuarios...</p>}
                {error && <p style={{ color: '#dc2626' }}>Error: {error}</p>}

                {!loading && !error && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>ID</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Username</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Email</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Rol</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right', color: '#374151', fontWeight: '600' }}>LogixPoints</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'center', color: '#374151', fontWeight: '600' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, idx) => (
                                    <tr
                                        key={user.id}
                                        style={{ borderBottom: '1px solid #f3f4f6', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}
                                    >
                                        <td style={{ padding: '10px 12px', color: '#9ca3af', fontFamily: 'monospace' }}>#{user.id}</td>
                                        <td style={{ padding: '10px 12px', fontWeight: '600', color: '#111' }}>{user.username}</td>
                                        <td style={{ padding: '10px 12px', color: '#6b7280' }}>{user.email}</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                background: user.role === 'ROLE_ADMIN' ? '#ede9fe' : user.role === 'ROLE_WAREHOUSE_MANAGER' ? '#fef3c7' : '#dbeafe',
                                                color: user.role === 'ROLE_ADMIN' ? '#6d28d9' : user.role === 'ROLE_WAREHOUSE_MANAGER' ? '#92400e' : '#1d4ed8',
                                            }}>
                                                {user.role.replace('ROLE_', '')}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                            <span style={{
                                                fontWeight: 'bold',
                                                fontSize: '16px',
                                                color: user.logixPoints > 0 ? '#7c3aed' : '#9ca3af',
                                            }}>
                                                {user.logixPoints.toLocaleString('es-CL')}
                                            </span>
                                            {user.logixPoints > 0 && (
                                                <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '4px' }}>pts</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => fillForm(user.username)}
                                                style={{
                                                    padding: '4px 12px',
                                                    background: '#ede9fe',
                                                    color: '#6d28d9',
                                                    border: '1px solid #c4b5fd',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                Ajustar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No hay usuarios registrados.</p>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
