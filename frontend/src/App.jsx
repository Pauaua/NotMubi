import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Plans from './pages/Plans';
import MySubscription from './pages/MySubscription';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import MovieForm from './pages/admin/MovieForm';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="loading">Cargando...</div>;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
    const { isAuthenticated, loading, user } = useAuth();
    if (loading) return <div className="loading">Cargando...</div>;
    if (!isAuthenticated) return children;
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/movies'} replace />;
}

function AppLayout({ children }) {
    return (
        <div className="app">
            <Navbar />
            <main className="main-content">{children}</main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                    <Route path="/" element={<Navigate to="/movies" replace />} />

                    <Route path="/movies" element={<AppLayout><Movies /></AppLayout>} />
                    <Route path="/movies/:id" element={<PrivateRoute><AppLayout><MovieDetail /></AppLayout></PrivateRoute>} />

                    <Route path="/plans" element={<AppLayout><Plans /></AppLayout>} />
                    <Route path="/my-subscription" element={<PrivateRoute><AppLayout><MySubscription /></AppLayout></PrivateRoute>} />

                    {/* ============ ADMIN ============ */}
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="movies" element={<AdminMovies />} />
                        <Route path="movies/new" element={<MovieForm />} />
                        <Route path="movies/edit/:id" element={<MovieForm />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="reviews" element={<AdminReviews />} />
                        <Route path="subscriptions" element={<AdminSubscriptions />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/movies" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}