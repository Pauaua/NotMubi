import { NavLink, Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <Link to="/movies" className="sidebar-logo">🎬 NotMubi</Link>
                    <span className="sidebar-badge">ADMIN</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
                    >
                        <span className="sidebar-icon">📊</span> Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/movies"
                        className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
                    >
                        <span className="sidebar-icon">🎞️</span> Películas
                    </NavLink>
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
                    >
                        <span className="sidebar-icon">👥</span> Usuarios
                    </NavLink>
                    <NavLink
                        to="/admin/reviews"
                        className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
                    >
                        <span className="sidebar-icon">⭐</span> Reviews
                    </NavLink>
                    <NavLink
                        to="/admin/subscriptions"
                        className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
                    >
                        <span className="sidebar-icon">💳</span> Suscripciones
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/movies" className="sidebar-back">← Volver al sitio</Link>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}