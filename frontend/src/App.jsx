import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Plans from './pages/Plans';
import MySubscription from './pages/MySubscription';

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="loading">Cargando...</div>;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="loading">Cargando...</div>;
    return isAuthenticated ? <Navigate to="/movies" replace /> : children;
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

                    <Route path="/movies" element={
                        <AppLayout><Movies /></AppLayout>
                    } />
                    <Route path="/movies/:id" element={
                        <PrivateRoute><AppLayout><MovieDetail /></AppLayout></PrivateRoute>
                    } />

                    <Route path="/plans" element={
                        <AppLayout><Plans /></AppLayout>
                    } />
                    <Route path="/my-subscription" element={
                        <PrivateRoute><AppLayout><MySubscription /></AppLayout></PrivateRoute>
                    } />

                    <Route path="*" element={<Navigate to="/movies" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}