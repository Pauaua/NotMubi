import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SuggestMovie() {
    const [form, setForm] = useState({ title: '', year: '', director: '', reason: '', email: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="suggest-page">
            <div className="suggest-card">
                <Link to="/" className="suggest-back">← Volver</Link>
                <h1>Sugerir una película</h1>
                <p className="suggest-subtitle">
                    ¿Conoces una joya incomprendida que merece estar aquí? Cuéntanos.
                </p>

                {sent ? (
                    <div className="suggest-success">
                        <div className="suggest-success-icon">🎬</div>
                        <h2>¡Gracias por tu sugerencia!</h2>
                        <p>La revisaremos y si cumple con los estándares de <em>lo suficientemente mala</em>, la añadiremos al catálogo.</p>
                        <button className="btn-primary" onClick={() => setSent(false)}>Sugerir otra</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="suggest-form">
                        <div className="form-group">
                            <label>Título de la película *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Ej: Plan 9 from Outer Space"
                                required
                            />
                        </div>
                        <div className="suggest-row">
                            <div className="form-group">
                                <label>Año</label>
                                <input
                                    type="number"
                                    value={form.year}
                                    onChange={e => setForm({ ...form, year: e.target.value })}
                                    placeholder="1957"
                                    min="1888"
                                    max={new Date().getFullYear()}
                                />
                            </div>
                            <div className="form-group">
                                <label>Director</label>
                                <input
                                    type="text"
                                    value={form.director}
                                    onChange={e => setForm({ ...form, director: e.target.value })}
                                    placeholder="Ed Wood"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>¿Por qué merece estar en NotMubi? *</label>
                            <textarea
                                value={form.reason}
                                onChange={e => setForm({ ...form, reason: e.target.value })}
                                placeholder="Es tan mala que... / Tiene una escena donde... / El director claramente..."
                                rows={4}
                                required
                                style={{ width: '100%', resize: 'vertical' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tu email (opcional, para avisarte si la añadimos)</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="tu@email.com"
                            />
                        </div>
                        <button type="submit" className="btn-primary btn-full">
                            Enviar sugerencia
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
