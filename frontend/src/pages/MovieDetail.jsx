import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const CULT_LEVEL_LABELS = {
    LEGENDARY: '🏆 Legendaria',
    SO_BAD_IT_IS_GOOD: '😂 Tan mala que es buena',
    HIDDEN_GEM: '💎 Joya oculta',
    GUILTY_PLEASURE: '😅 Placer culpable'
};

export default function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadMovie();
    }, [id]);

    const loadMovie = async () => {
        try {
            const response = await api.get(`/api/movies/${id}`);
            setMovie(response.data);
        } catch (err) {
            setError('No se pudo cargar la película');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container"><div className="loading">Cargando...</div></div>;
    if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
    if (!movie) return null;

    return (
        <div className="container">
            <Link to="/movies" className="back-link">← Volver al catálogo</Link>

            <div className="movie-detail">
                <span className="movie-cult-level-lg">
                    {CULT_LEVEL_LABELS[movie.cultLevel] || movie.cultLevel}
                </span>

                <h1>{movie.title}</h1>
                <p className="movie-detail-meta">
                    <strong>{movie.year}</strong> · Dirigida por <strong>{movie.director}</strong>
                </p>

                <p className="movie-detail-rating">⭐ {movie.rating} / 10</p>

                <div className="movie-detail-synopsis">
                    <h3>Sinopsis</h3>
                    <p>{movie.synopsis}</p>
                </div>
            </div>
        </div>
    );
}