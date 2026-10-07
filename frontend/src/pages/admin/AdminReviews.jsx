import { useState, useEffect } from 'react';
import api from '../../services/api';

const STARS = [1, 2, 3, 4, 5];
const EMPTY_FORM = { movieId: '', userId: '', username: '', rating: 5, comment: '' };

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', review }
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        Promise.all([loadReviews(), loadMovies()]);
    }, []);

    const loadReviews = async () => {
        try {
            const res = await api.get('/api/reviews');
            setReviews(res.data);
        } catch {
            setError('No se pudieron cargar las reviews');
        } finally {
            setLoading(false);
        }
    };

    const loadMovies = async () => {
        try {
            const res = await api.get('/api/movies');
            setMovies(res.data);
        } catch { /* non-critical */ }
    };

    const openCreate = () => {
        setForm(EMPTY_FORM);
        setFormError('');
        setModal({ mode: 'create' });
    };

    const openEdit = (r) => {
        setForm({ movieId: r.movieId, userId: r.userId, username: r.username, rating: r.rating, comment: r.comment || '' });
        setFormError('');
        setModal({ mode: 'edit', review: r });
    };

    const closeModal = () => setModal(null);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');
        const payload = {
            movieId: Number(form.movieId),
            userId: Number(form.userId),
            username: form.username,
            rating: Number(form.rating),
            comment: form.comment,
        };
        try {
            if (modal.mode === 'create') {
                const res = await api.post('/api/reviews', payload);
                setReviews([res.data, ...reviews]);
            } else {
                const res = await api.put(`/api/reviews/${modal.review.id}`, payload);
                setReviews(reviews.map(r => r.id === modal.review.id ? res.data : r));
            }
            closeModal();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Error al guardar la review');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta review?')) return;
        try {
            await api.delete(`/api/reviews/${id}`);
            setReviews(reviews.filter(r => r.id !== id));
        } catch { alert('Error al eliminar la review'); }
    };

    if (loading) return <div className="loading">Cargando reviews...</div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <h1>Reviews</h1>
                <p className="admin-welcome">Total: {reviews.length} reseñas.</p>
            </header>

            <div style={{ marginBottom: '1rem' }}>
                <button className="btn-primary" onClick={openCreate}>+ Nueva review</button>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Película</th>
                            <th>Usuario</th>
                            <th>Rating</th>
                            <th>Comentario</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay reviews aún.</td></tr>
                        ) : reviews.map(r => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.movieTitle}</td>
                                <td>{r.username}</td>
                                <td>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {r.comment || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                                </td>
                                <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-ES') : '—'}</td>
                                <td className="admin-actions">
                                    <button className="btn-small btn-edit" onClick={() => openEdit(r)}>Editar</button>
                                    <button className="btn-small btn-delete" onClick={() => handleDelete(r.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{modal.mode === 'create' ? 'Nueva review' : 'Editar review'}</h2>
                        {formError && <div className="alert alert-error">{formError}</div>}
                        <form onSubmit={handleSave}>
                            {modal.mode === 'create' && (
                                <>
                                    <div className="form-group">
                                        <label>Película</label>
                                        <select
                                            value={form.movieId}
                                            onChange={e => setForm({ ...form, movieId: e.target.value })}
                                            required
                                            className="role-select"
                                        >
                                            <option value="">Selecciona una película</option>
                                            {movies.map(m => (
                                                <option key={m.id} value={m.id}>{m.title} ({m.year})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>ID de usuario</label>
                                        <input
                                            type="number"
                                            value={form.userId}
                                            onChange={e => setForm({ ...form, userId: e.target.value })}
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Nombre de usuario</label>
                                        <input
                                            type="text"
                                            value={form.username}
                                            onChange={e => setForm({ ...form, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label>Rating</label>
                                <select
                                    value={form.rating}
                                    onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                                    className="role-select"
                                >
                                    {STARS.map(s => (
                                        <option key={s} value={s}>{'★'.repeat(s)} ({s}/5)</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comentario</label>
                                <textarea
                                    value={form.comment}
                                    onChange={e => setForm({ ...form, comment: e.target.value })}
                                    rows={3}
                                    style={{ width: '100%', resize: 'vertical' }}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
