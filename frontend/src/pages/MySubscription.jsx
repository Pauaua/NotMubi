import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MySubscription() {
    const [sub, setSub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadSubscription();
    }, []);

    const loadSubscription = async () => {
        try {
            const response = await api.get('/api/subscriptions/me');
            setSub(response.data);
        } catch (err) {
            if (err.response?.status === 500 || err.response?.status === 404) {
                setError('No tienes ninguna suscripción activa');
            } else {
                setError('No se pudo cargar tu suscripción');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('¿Seguro que quieres cancelar tu suscripción?')) return;

        setCancelling(true);
        try {
            await api.post('/api/subscriptions/me/cancel');
            alert('Suscripción cancelada');
            navigate('/plans');
        } catch (err) {
            alert('Error al cancelar');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return <div className="container"><div className="loading">Cargando...</div></div>;

    if (error) {
        return (
            <div className="container">
                <div className="alert alert-info">{error}</div>
                <Link to="/plans" className="btn-primary">Ver planes disponibles</Link>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="page-title">Mi suscripción</h1>

            <div className="subscription-card">
                <div className="subscription-header">
                    <h2>{sub.subscription.plan.name}</h2>
                    <span className={`status-badge status-${sub.subscription.status.toLowerCase()}`}>
                        {sub.subscription.status}
                    </span>
                </div>

                <div className="subscription-details">
                    <p><strong>Precio:</strong> {sub.subscription.plan.price.toFixed(2)} € / mes</p>
                    <p><strong>Usuario:</strong> {sub.user.username} ({sub.user.email})</p>
                    <p><strong>Iniciada:</strong> {new Date(sub.subscription.startedAt).toLocaleDateString()}</p>
                    <p><strong>Expira:</strong> {new Date(sub.subscription.expiresAt).toLocaleDateString()}</p>
                </div>

                <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="btn-danger btn-full"
                >
                    {cancelling ? 'Cancelando...' : 'Cancelar suscripción'}
                </button>
            </div>
        </div>
    );
}