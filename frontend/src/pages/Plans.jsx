import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Plans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [subscribing, setSubscribing] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const response = await api.get('/api/subscriptions/plans');
            setPlans(response.data);
        } catch (err) {
            setError('No se pudieron cargar los planes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setSubscribing(planId);
        try {
            await api.post('/api/subscriptions/subscribe', { planId });
            alert('¡Suscripción realizada con éxito!');
            navigate('/my-subscription');
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al suscribirse';
            alert(msg);
        } finally {
            setSubscribing(null);
        }
    };

    if (loading) return <div className="container"><div className="loading">Cargando planes...</div></div>;
    if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;

    return (
        <div className="container">
            <h1 className="page-title">Elige tu plan de culto</h1>

            <div className="plans-grid">
                {plans.map((plan) => (
                    <div key={plan.id} className="plan-card">
                        <h2>{plan.name}</h2>
                        <p className="plan-price">{plan.price.toFixed(2)} € / mes</p>
                        <p className="plan-description">{plan.description}</p>
                        <ul className="plan-features">
                            <li>
                                {plan.maxMovies === -1
                                    ? 'Películas ilimitadas'
                                    : `Hasta ${plan.maxMovies} películas`}
                            </li>
                            <li>Acceso: {plan.cultLevelAccess}</li>
                        </ul>
                        <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={subscribing === plan.id}
                            className="btn-primary btn-full"
                        >
                            {subscribing === plan.id ? 'Suscribiendo...' : 'Suscribirse'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}