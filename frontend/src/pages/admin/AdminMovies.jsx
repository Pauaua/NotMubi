import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CULT_LEVEL_LABELS = {
    LEGENDARY: '🏆 Legendaria',
    SO_BAD_IT_IS_GOOD: '😂 Tan mala que es buena',
    HIDDEN_GEM: '💎 Joya oculta',
    GUILTY_PLEASURE: '😅 Placer culpable'
};

export default function AdminMovies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {
        try {
            const response = await api.get('/api/movies');
            setMovies(response.data);
        } catch (err) {
            setError('No se pudieron cargar las películas');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`¿Seguro que quieres eliminar "${title}"?`)) return;

        try {
            await api.delete(`/api/movies/${id}`);
            setMovies(movies.filter((m) => m.id !== id));
        } catch (err) {
            alert('Error al eliminar la película');
        }
    };

    if (loading) return <div className="loading">Cargando películas...</div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>Panel de administración</h1>
                <Link to="/admin/movies/new" className="btn-primary">
                    + Nueva película
                </Link>
            </div>

            <p className="admin-subtitle">
                Total: {movies.length} películas
            </p>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Año</th>
                            <th>Nivel</th>
                            <th>Rating</th>
                            <th>Video</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td>{movie.id}</td>
                                <td>{movie.title}</td>
                                <td>{movie.year}</td>
                                <td>{CULT_LEVEL_LABELS[movie.cultLevel] || movie.cultLevel}</td>
                                <td>{movie.rating}</td>
                                <td>
                                    {movie.videoUrl ? (
                                        <a href={movie.videoUrl} target="_blank" rel="noreferrer" className="link-small">
                                            Ver en YouTube
                                        </a>
                                    ) : (
                                        <span className="text-muted">—</span>
                                    )}
                                </td>
                                <td className="admin-actions">
                                    <Link to={`/admin/movies/edit/${movie.id}`} className="btn-small btn-edit">
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(movie.id, movie.title)}
                                        className="btn-small btn-delete"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {movies.length === 0 && (
                <p className="empty-message">No hay películas en el catálogo.</p>
            )}
        </div>
    );
}