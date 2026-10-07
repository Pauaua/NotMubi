import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CULT_THEMES = {
    LEGENDARY:        { label: '🏆 Legendaria',           from: '#f39c12', to: '#e74c3c', glow: '#f39c12' },
    SO_BAD_IT_IS_GOOD:{ label: '😂 Tan mala que es buena', from: '#ff4757', to: '#c0392b', glow: '#ff6b6b' },
    HIDDEN_GEM:       { label: '💎 Joya oculta',           from: '#00b894', to: '#0984e3', glow: '#00cec9' },
    GUILTY_PLEASURE:  { label: '😅 Placer culpable',       from: '#6c5ce7', to: '#a855f7', glow: '#a29bfe' },
};

export default function HeroSlider({ movies }) {
    const [current, setCurrent] = useState(0);
    const [fading, setFading] = useState(false);

    const goTo = (idx) => {
        setFading(true);
        setTimeout(() => {
            setCurrent(idx);
            setFading(false);
        }, 400);
    };

    useEffect(() => {
        if (movies.length < 2) return;
        const timer = setInterval(() => {
            setCurrent(prev => {
                const next = (prev + 1) % movies.length;
                setFading(true);
                setTimeout(() => setFading(false), 400);
                return next;
            });
        }, 4500);
        return () => clearInterval(timer);
    }, [movies.length]);

    if (!movies.length) return (
        <section className="hero-slider" style={{ '--glow': '#ff4757', '--from': '#ff4757', '--to': '#c0392b' }}>
            <div className="hero-bg" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0505 60%, #0a0a0a 100%)' }} />
            <div className="hero-glow-orb" style={{ background: 'radial-gradient(circle, #ff475733 0%, transparent 70%)' }} />
            <div className="hero-content hero-fade-in">
                <div className="hero-badge" style={{ background: 'linear-gradient(90deg, #ff4757, #c0392b)' }}>🎬 NotMubi</div>
                <h1 className="hero-title">El cine que no debería existir.<br />Pero existe.</h1>
                <p className="hero-synopsis">Un catálogo de películas de culto: las legendarias, las tan malas que son buenas, las joyas ocultas y los placeres culpables.</p>
            </div>
        </section>
    );

    const movie = movies[current];
    const theme = CULT_THEMES[movie.cultLevel] || CULT_THEMES.SO_BAD_IT_IS_GOOD;

    return (
        <section
            className="hero-slider"
            style={{ '--glow': theme.glow, '--from': theme.from, '--to': theme.to }}
        >
            <div className="hero-bg" style={{
                background: movie.thumbnailUrl
                    ? `linear-gradient(135deg, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.4)), url(${movie.thumbnailUrl}) center/cover no-repeat`
                    : `linear-gradient(135deg, #0a0a0a 0%, color-mix(in srgb, ${theme.from} 15%, #0a0a0a) 50%, color-mix(in srgb, ${theme.to} 20%, #0a0a0a) 100%)`
            }} />

            <div className={`hero-content ${fading ? 'hero-fade-out' : 'hero-fade-in'}`}>
                <div className="hero-badge" style={{ background: `linear-gradient(90deg, ${theme.from}, ${theme.to})` }}>
                    {theme.label}
                </div>
                <h1 className="hero-title" style={{ textShadow: `0 0 40px ${theme.glow}55` }}>
                    {movie.title}
                </h1>
                <p className="hero-year">{movie.year}{movie.director ? ` · ${movie.director}` : ''}</p>
                {movie.synopsis && (
                    <p className="hero-synopsis">{movie.synopsis.slice(0, 160)}{movie.synopsis.length > 160 ? '…' : ''}</p>
                )}
                <Link to={`/movies/${movie.id}`} className="hero-cta" style={{
                    boxShadow: `0 0 24px ${theme.glow}88`,
                    borderColor: theme.glow,
                }}>
                    Ver película →
                </Link>
            </div>

            <div className="hero-dots">
                {movies.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-dot ${i === current ? 'hero-dot-active' : ''}`}
                        onClick={() => goTo(i)}
                        style={i === current ? { background: theme.glow, boxShadow: `0 0 8px ${theme.glow}` } : {}}
                    />
                ))}
            </div>

            <div className="hero-glow-orb" style={{ background: `radial-gradient(circle, ${theme.glow}33 0%, transparent 70%)` }} />
        </section>
    );
}
