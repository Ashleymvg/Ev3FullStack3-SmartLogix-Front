import { usePoints } from '../hooks/usePoints';

/**
 * Muestra el saldo de LogixPoints del usuario en el sidebar.
 * Se integra en App.jsx dentro de la barra lateral.
 */
export default function PointsBadge() {
    const { points, loading } = usePoints();

    return (
        <div style={{
            background: 'rgba(192, 132, 252, 0.15)',
            border: '1px solid rgba(192, 132, 252, 0.4)',
            borderRadius: '10px',
            padding: '10px 12px',
            marginBottom: '20px',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '11px', color: '#a0a0a0', marginBottom: '2px', letterSpacing: '0.5px' }}>
                LOGIXPOINTS
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#c084fc' }}>
                {loading ? '...' : points.toLocaleString('es-CL')}
            </div>
            <div style={{ fontSize: '10px', color: '#a0a0a0', marginTop: '2px' }}>
                ${loading ? '...' : points.toLocaleString('es-CL')} disponibles
            </div>
        </div>
    );
}
