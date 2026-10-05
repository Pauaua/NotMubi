import { Link } from 'react-router-dom';

const CULT_LEVEL_LABELS = {
    LEGENDARY: '🏆 Legendaria',
    SO_BAD_IT_IS_GOOD: '😂 Tan mala que es buena',
    HIDDEN_GEM: '💎 Joya oculta',
    GUILTY_PLEASURE: '😅 Placer culpable'
};

export default function MovieCard({ movie }) {
    return (
        <Link to={`/movies/${movie.id}`} className="movie-card">
            <div className="movie-card-header">
                <span className="movie-cult-level">
                    {CULT_LEVEL_LABELS[movie.cultLevel] || movie.cultLevel}
                </span>
            </div>
            <div className="movie-card-body">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-meta">
                    {movie.year} · {movie.director}
                </p>
                <p className="movie-rating">⭐ {movie.rating}</p>
            </div>
        </Link>
    );
}