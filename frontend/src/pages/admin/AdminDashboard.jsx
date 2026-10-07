import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();

    const modules = [
        {
            to: '/admin/movies',
            icon: '🎞️',
            title: 'Películas',
            description: 'Gestiona el catálogo de cine de culto.'
        },
        {
            to: '/admin/users',
            icon: '👥',
            title: 'Usuarios',
            description: 'Administra los usuarios de la plataforma.'
        },
        {
            to: '/admin/reviews',
            icon: '⭐',
            title: 'Reviews',
            description: 'Modera las reseñas de los usuarios.'
        },
        {
            to: '/admin/subscriptions',
            icon: '💳',
            title: 'Suscripciones',
            description: 'Gestiona los planes y las suscripciones activas.'
        }
    ];

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <h1>Dashboard</h1>
                <p className="admin-welcome">
                    Bienvenida, <strong>{user?.username}</strong>. Este es el panel de administración de NotMubi.
                </p>
            </header>

            <div className="admin-modules-grid">
                {modules.map((m) => (
                    <Link key={m.to} to={m.to} className="admin-module-card">
                        <div className="module-icon">{m.icon}</div>
                        <h3>{m.title}</h3>
                        <p>{m.description}</p>
                        <span className="module-cta">Ir al módulo →</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}