import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HeroSlider from '../components/HeroSlider';

const CULT_LABELS = {
    LEGENDARY: '🏆 Legendaria',
    SO_BAD_IT_IS_GOOD: '😂 Tan mala que es buena',
    HIDDEN_GEM: '💎 Joya oculta',
    GUILTY_PLEASURE: '😅 Placer culpable',
};

const CULT_COLORS = {
    LEGENDARY: '#f39c12',
    SO_BAD_IT_IS_GOOD: '#ff4757',
    HIDDEN_GEM: '#00b894',
    GUILTY_PLEASURE: '#a855f7',
};

const WHY_CARDS = [
    {
        icon: '🎭',
        color: '#ff4757',
        title: 'El fracaso como arte',
        text: 'Hay películas que fallan tan espectacularmente en lo que intentan que terminan logrando algo completamente distinto: una obra única, irrepetible, imposible de fabricar a propósito.',
    },
    {
        icon: '🧠',
        color: '#00b894',
        title: 'El goce de lo absurdo',
        text: 'Ver un plano imposible, un diálogo inverosímil o una actuación que desafía la física produce un placer extraño y genuino. Es cine que te obliga a estar presente.',
    },
    {
        icon: '👁️',
        color: '#0984e3',
        title: 'Son cine, igual',
        text: 'Detrás de cada película mala hay alguien que quiso hacer algo. Esa voluntad, aunque el resultado sea desastroso, merece ser vista. El cine no termina donde termina la calidad.',
    },
    {
        icon: '🔥',
        color: '#a855f7',
        title: 'La comunidad del mal gusto',
        text: 'Verlas en grupo las transforma. Lo que solas son insufribles, juntas se vuelven legendarias. NotMubi existe para que esa experiencia no se pierda.',
    },
];

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/movies').then(r => setMovies(r.data)).catch(() => {});
        axios.get('http://localhost:8080/api/subscriptions/plans').then(r => setPlans(r.data)).catch(() => {});
    }, []);

    const featured = movies.slice(0, 6);

    return (
        <div className="home">
            {/* HERO */}
            <HeroSlider movies={movies} />

            {/* ¿POR QUÉ? */}
            <section className="home-section why-section">
                <div className="home-container">
                    <div className="section-eyebrow">El manifiesto</div>
                    <h2 className="section-title">
                        ¿Por qué un catálogo<br />
                        <span className="gradient-text">de cine malo?</span>
                    </h2>
                    <p className="section-lead">
                        Porque lo malo no es lo opuesto a lo bueno. A veces es exactamente lo mismo,
                        visto desde otro ángulo.
                    </p>
                    <div className="why-grid">
                        {WHY_CARDS.map(card => (
                            <div
                                key={card.title}
                                className="why-card"
                                style={{ '--card-color': card.color }}
                            >
                                <div className="why-icon">{card.icon}</div>
                                <h3>{card.title}</h3>
                                <p>{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATÁLOGO PREVIEW */}
            <section className="home-section catalog-section">
                <div className="home-container">
                    <div className="section-eyebrow">El catálogo</div>
                    <h2 className="section-title">
                        Películas que no deberías<br />
                        <span className="gradient-text-cyan">pero igual vas a ver</span>
                    </h2>
                    <div className="catalog-preview-grid">
                        {featured.map(movie => (
                            <Link to={`/movies/${movie.id}`} key={movie.id} className="preview-card">
                                <div
                                    className="preview-card-bg"
                                    style={{
                                        background: movie.thumbnailUrl
                                            ? `linear-gradient(180deg, transparent 30%, #0a0a0a 100%), url(${movie.thumbnailUrl}) center/cover`
                                            : `linear-gradient(135deg, color-mix(in srgb, ${CULT_COLORS[movie.cultLevel] || '#ff4757'} 20%, #111) 0%, #0a0a0a 100%)`,
                                    }}
                                />
                                <div className="preview-card-body">
                                    <span
                                        className="preview-cult-badge"
                                        style={{ color: CULT_COLORS[movie.cultLevel] || '#ff4757' }}
                                    >
                                        {CULT_LABELS[movie.cultLevel]}
                                    </span>
                                    <h3 className="preview-title">{movie.title}</h3>
                                    <p className="preview-year">{movie.year}</p>
                                </div>
                                <div
                                    className="preview-card-glow"
                                    style={{ '--glow-color': CULT_COLORS[movie.cultLevel] || '#ff4757' }}
                                />
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <Link to="/movies" className="btn-outline-glow">Ver catálogo completo →</Link>
                    </div>
                </div>
            </section>

            {/* PLANES */}
            <section className="home-section plans-section">
                <div className="home-container">
                    <div className="section-eyebrow">Suscripciones</div>
                    <h2 className="section-title">
                        Elige tu nivel de<br />
                        <span className="gradient-text-purple">tolerancia al mal cine</span>
                    </h2>
                    <div className="plans-grid">
                        {plans.length === 0 ? (
                            <p style={{ color: '#555', textAlign: 'center', width: '100%' }}>Cargando planes…</p>
                        ) : plans.map((plan, i) => (
                            <div key={plan.id} className={`plan-card ${i === 1 ? 'plan-card-featured' : ''}`}>
                                {i === 1 && <div className="plan-badge">Más popular</div>}
                                <h3 className="plan-name">{plan.name}</h3>
                                <div className="plan-price">
                                    <span className="plan-currency">$</span>
                                    {parseFloat(plan.price).toFixed(2)}
                                    <span className="plan-period">/mes</span>
                                </div>
                                {plan.description && <p className="plan-desc">{plan.description}</p>}
                                <ul className="plan-features">
                                    {plan.maxMovies && <li>✓ Hasta {plan.maxMovies} películas</li>}
                                    {plan.cultLevelAccess && <li>✓ Acceso: {plan.cultLevelAccess}</li>}
                                    <li>✓ Catálogo de culto curado</li>
                                    <li>✓ Acceso desde cualquier dispositivo</li>
                                </ul>
                                <Link to="/plans" className={`plan-cta ${i === 1 ? 'plan-cta-featured' : ''}`}>
                                    Suscribirse
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* QUOTE BANNER */}
            <section className="quote-banner">
                <div className="quote-orb quote-orb-left" />
                <div className="quote-orb quote-orb-right" />
                <div className="home-container" style={{ position: 'relative', zIndex: 1 }}>
                    <blockquote className="quote-text">
                        "El cine malo también es cine.<br />
                        <em>Solo que más honesto.</em>"
                    </blockquote>
                    <p className="quote-attr">— NotMubi</p>
                    <Link to="/movies" className="btn-outline-glow" style={{ marginTop: '2rem', display: 'inline-block' }}>
                        Entrar al catálogo
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="landing-footer">
                <div className="home-container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <span className="footer-logo">🎬 NotMubi</span>
                            <p>El catálogo definitivo del cine de culto.<br />Películas malas, vistas con amor.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Explorar</h4>
                            <ul>
                                <li><Link to="/movies">Catálogo</Link></li>
                                <li><Link to="/plans">Planes</Link></li>
                                <li><Link to="/suggest">Sugerir una película</Link></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4>Legal</h4>
                            <ul>
                                <li><Link to="/legal">Políticas legales</Link></li>
                                <li><Link to="/privacy">Privacidad</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>
                            Made with <span className="footer-heart">♥</span> for{' '}
                            <a href="https://phantasia.cl" target="_blank" rel="noreferrer" className="footer-phantasia">
                                Phantasia.cl
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
