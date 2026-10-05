import { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../context/AuthContext';

export default function Movies() {
    const [movies, setMovies] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadMovies();
    }, []);

    useEffect(() => {
        if (!search) {
            setFiltered(movies);
        } else {
            setFiltered(
                movies.filter((m) =>
                    m.title.toLowerCase().includes(search.toLowerCase()) ||
                    (m.director && m.director.toLowerCase().includes(search.toLowerCase()))
                )
            );
        }
    }, [search, movies]);

    const loadMovies = async () => {
        try {
            const response = await api.get('/api/movies');
            setMovies(response.data);
            setFiltered(response.data);
        } catch (err) {
            setError('No se pudieron cargar las películas');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container">
                <div className="alert alert-info">
                    Inicia sesión para ver el catálogo completo de NotMubi.
                </div>
            </div>
        );
    }

    if (loading) return <div className="container"><div className="loading">Cargando películas...</div></div>;
    if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>Catálogo de culto</h1>
                <input
                    type="text"
                    placeholder="Buscar por título o director..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            {filtered.length === 0 ? (
                <p className="empty-message">No hay películas que coincidan con tu búsqueda.</p>
            ) : (
                <div className="movies-grid">
                    {filtered.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}