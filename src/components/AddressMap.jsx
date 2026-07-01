import { useEffect, useRef, useState } from "react";

// Centro por defecto: Santiago, Chile
const DEFAULT_CENTER = [-33.4489, -70.6693];
const DEFAULT_ZOOM = 12;

function AddressMap({ onSelectAddress }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const [searchText, setSearchText] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [mapError, setMapError] = useState("");

    // Inicializa el mapa una sola vez
    useEffect(() => {
        if (!window.L) {
            setMapError("No se pudo cargar el mapa (Leaflet no disponible).");
            return;
        }
        if (mapRef.current || !mapContainerRef.current) return;

        const map = window.L.map(mapContainerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        map.on("click", (e) => {
            placeMarker(e.latlng.lat, e.latlng.lng);
            reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function placeMarker(lat, lng) {
        const map = mapRef.current;
        if (!map) return;
        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        } else {
            markerRef.current = window.L.marker([lat, lng]).addTo(map);
        }
        map.setView([lat, lng], Math.max(map.getZoom(), 15));
    }

    async function reverseGeocode(lat, lng) {
        setLoading(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await res.json();
            const address = data?.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setSelectedAddress(address);
            onSelectAddress(address);
        } catch (err) {
            const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setSelectedAddress(fallback);
            onSelectAddress(fallback);
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(e) {
        e.preventDefault();
        if (!searchText.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1`
            );
            const results = await res.json();
            if (results && results.length > 0) {
                const { lat, lon, display_name } = results[0];
                placeMarker(parseFloat(lat), parseFloat(lon));
                setSelectedAddress(display_name);
                onSelectAddress(display_name);
            } else {
                alert("No se encontraron resultados para esa dirección.");
            }
        } catch (err) {
            alert("Error buscando la dirección: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
            <h2 style={{ color: '#111111', marginTop: 0, marginBottom: '15px' }}>Seleccionar Dirección de Envío en el Mapa</h2>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Buscar dirección (ej: Av. Providencia 1234, Santiago)"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ flex: 1, padding: '8px' }}
                />
                <button type="submit" style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                    Buscar
                </button>
            </form>

            {mapError && <p style={{ color: 'red' }}>{mapError}</p>}

            <div ref={mapContainerRef} style={{ width: '100%', height: '300px', borderRadius: '6px', border: '1px solid #ccc' }} />

            <p style={{ marginTop: '10px', fontSize: '13px', color: '#3d2b5e' }}>
                Haz click en el mapa para seleccionar el punto exacto de envío.
            </p>

            {loading && <p style={{ color: '#007bff', fontSize: '13px' }}>Buscando dirección...</p>}

            {selectedAddress && !loading && (
                <p style={{ fontSize: '13px', color: '#155724', backgroundColor: '#d4edda', padding: '8px', borderRadius: '4px' }}>
                    <strong>Dirección seleccionada:</strong> {selectedAddress}
                </p>
            )}
        </div>
    );
}

export default AddressMap;
