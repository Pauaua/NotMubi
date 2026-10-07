import { useState, useEffect } from 'react';
import api from '../../services/api';

const EMPTY_PLAN = { name: '', price: '', description: '', maxMovies: '', cultLevelAccess: '' };

export default function AdminSubscriptions() {
    const [plans, setPlans] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [loadingSubs, setLoadingSubs] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', plan }
    const [form, setForm] = useState(EMPTY_PLAN);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        loadPlans();
        loadSubscriptions();
    }, []);

    const loadPlans = async () => {
        try {
            const res = await api.get('/api/subscriptions/plans');
            setPlans(res.data);
        } catch {
            setError('No se pudieron cargar los planes');
        } finally {
            setLoadingPlans(false);
        }
    };


    const loadSubscriptions = async () => {
        try {
            const res = await api.get('/api/subscriptions/all');
            setSubscriptions(res.data);
        } catch { /* vacío si falla */ } finally {
            setLoadingSubs(false);
        }
    };

    const openCreate = () => {
        setForm(EMPTY_PLAN);
        setFormError('');
        setModal({ mode: 'create' });
    };

    const openEdit = (p) => {
        setForm({
            name: p.name,
            price: p.price,
            description: p.description || '',
            maxMovies: p.maxMovies ?? '',
            cultLevelAccess: p.cultLevelAccess || '',
        });
        setFormError('');
        setModal({ mode: 'edit', plan: p });
    };

    const closeModal = () => setModal(null);

    const handleSavePlan = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');
        const payload = {
            name: form.name,
            price: parseFloat(form.price),
            description: form.description || null,
            maxMovies: form.maxMovies ? parseInt(form.maxMovies) : null,
            cultLevelAccess: form.cultLevelAccess || null,
        };
        try {
            if (modal.mode === 'create') {
                const res = await api.post('/api/subscriptions/plans', payload);
                setPlans([...plans, res.data]);
            } else {
                const res = await api.put(`/api/subscriptions/plans/${modal.plan.id}`, payload);
                setPlans(plans.map(p => p.id === modal.plan.id ? res.data : p));
            }
            closeModal();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Error al guardar el plan');
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePlan = async (id, name) => {
        if (!window.confirm(`¿Eliminar el plan "${name}"?`)) return;
        try {
            await api.delete(`/api/subscriptions/plans/${id}`);
            setPlans(plans.filter(p => p.id !== id));
        } catch { alert('Error al eliminar el plan'); }
    };


    return (
        <div className="admin-page">
            {/* ===== PLANES ===== */}
            <header className="admin-page-header">
                <h1>Suscripciones</h1>
            </header>

            <section style={{ marginBottom: '2.5rem' }}>
                <div className="admin-section-header">
                    <h2>Planes</h2>
                    <button className="btn-primary" onClick={openCreate}>+ Nuevo plan</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loadingPlans ? (
                    <div className="loading">Cargando planes...</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Descripción</th>
                                    <th>Máx. películas</th>
                                    <th>Nivel acceso</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.length === 0 ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay planes.</td></tr>
                                ) : plans.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td><strong>{p.name}</strong></td>
                                        <td>${parseFloat(p.price).toFixed(2)}</td>
                                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {p.description || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                                        </td>
                                        <td>{p.maxMovies ?? '∞'}</td>
                                        <td>{p.cultLevelAccess || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                        <td className="admin-actions">
                                            <button className="btn-small btn-edit" onClick={() => openEdit(p)}>Editar</button>
                                            <button className="btn-small btn-delete" onClick={() => handleDeletePlan(p.id, p.name)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>


            {/* ===== HISTORIAL DE SUSCRIPCIONES ===== */}
            <section style={{ marginTop: '2.5rem' }}>
                <div className="admin-section-header">
                    <h2>Usuarios suscritos</h2>
                </div>
                {loadingSubs ? (
                    <div className="loading">Cargando...</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Plan</th>
                                    <th>Estado</th>
                                    <th>Inicio</th>
                                    <th>Vence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay suscripciones registradas.</td></tr>
                                ) : subscriptions.map(({ subscription: s, user: u }) => (
                                    <tr key={s.id}>
                                        <td>{u?.username || `Usuario #${s.userId}`}</td>
                                        <td><strong>{s.plan?.name}</strong></td>
                                        <td>
                                            <span className={`badge-status ${s.status === 'ACTIVE' ? 'badge-active' : s.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-expired'}`}>
                                                {s.status === 'ACTIVE' ? 'Activa' : s.status === 'CANCELLED' ? 'Cancelada' : 'Expirada'}
                                            </span>
                                        </td>
                                        <td>{s.startedAt ? new Date(s.startedAt).toLocaleDateString('es-ES') : '—'}</td>
                                        <td>{s.expiresAt ? new Date(s.expiresAt).toLocaleDateString('es-ES') : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* ===== MODAL PLAN ===== */}
            {modal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{modal.mode === 'create' ? 'Nuevo plan' : 'Editar plan'}</h2>
                        {formError && <div className="alert alert-error">{formError}</div>}
                        <form onSubmit={handleSavePlan}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Precio (USD)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    rows={2}
                                    style={{ width: '100%', resize: 'vertical' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Máx. películas (vacío = ilimitado)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.maxMovies}
                                    onChange={e => setForm({ ...form, maxMovies: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nivel de acceso cult</label>
                                <input
                                    type="text"
                                    value={form.cultLevelAccess}
                                    onChange={e => setForm({ ...form, cultLevelAccess: e.target.value })}
                                    placeholder="Ej: LEGENDARY, ALL..."
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
