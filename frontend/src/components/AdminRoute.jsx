import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return <div className="loading">Cargando...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'ADMIN') {
        return (
            <div className="container">
                <div className="alert alert-error">
                    No tienes permisos para acceder a esta sección.
                </div>
            </div>
        );
    }

    return children;
}