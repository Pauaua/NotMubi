import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <nav className="navbar">
            <Link to={isAdmin ? '/admin' : '/movies'} className="navbar-logo">🎬 NotMubi</Link>

            <div className="navbar-links">
                {isAdmin ? (
                    <>
                        <Link to="/movies">Catálogo</Link>
                        <Link to="/plans">Planes</Link>
                    </>
                ) : (
                    <>
                        <Link to="/movies">Catálogo</Link>
                        <Link to="/plans">Planes</Link>
                        {isAuthenticated && <Link to="/my-subscription">Mi suscripción</Link>}
                    </>
                )}
            </div>

            <div className="navbar-user">
                {isAuthenticated ? (
                    <>
                        <span className="navbar-username">
                            Hola, {user.username}
                            {isAdmin && <span className="badge-admin">ADMIN</span>}
                        </span>
                        <button onClick={handleLogout} className="btn-logout">Salir</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn-link">Entrar</Link>
                        <Link to="/register" className="btn-primary">Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
}