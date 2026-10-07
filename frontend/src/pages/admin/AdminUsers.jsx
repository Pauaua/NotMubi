import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EMPTY_FORM = { username: '', email: '', password: '', role: 'USER' };

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        loadUsers();
        loadSubscriptions();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await api.get('/auth/admin/users');
            setUsers(res.data);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                setError(`Error ${status}: sin autorización para obtener usuarios. Verifica que el auth-service esté reiniciado.`);
            } else {
                setError('No se pudieron cargar los usuarios');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadSubscriptions = async () => {
        try {
            const res = await api.get('/api/subscriptions/all');
            setSubscriptions(res.data);
        } catch { /* sin suscripciones */ }
    };

    const openCreate = () => {
        setForm(EMPTY_FORM);
        setFormError('');
        setModal({ mode: 'create' });
    };

    const openEdit = (u) => {
        setForm({ username: u.username, email: u.email || '', password: '', role: u.role });
        setFormError('');
        setModal({ mode: 'edit', user: u });
    };

    const closeModal = () => setModal(null);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');
        try {
            if (modal.mode === 'create') {
                await api.post('/auth/register', {
                    username: form.username,
                    password: form.password,
                    email: form.email,
                });
                await loadUsers();
            } else {
                const res = await api.put(`/auth/admin/users/${modal.user.id}`, {
                    username: form.username,
                    email: form.email,
                    role: form.role,
                });
                setUsers(users.map(u => u.id === modal.user.id ? res.data : u));
            }
            closeModal();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Error al guardar el usuario');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, username) => {
        if (id === currentUser?.userId) { alert('No puedes eliminar tu propia cuenta'); return; }
        if (!window.confirm(`¿Eliminar al usuario "${username}"?`)) return;
        try {
            await api.delete(`/auth/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch { alert('Error al eliminar el usuario'); }
    };

    if (loading) return <div className="loading">Cargando usuarios...</div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <h1>Usuarios</h1>
                <p className="admin-welcome">Total: {users.length} usuarios registrados.</p>
            </header>

            <div style={{ marginBottom: '1rem' }}>
                <button className="btn-primary" onClick={openCreate}>+ Nuevo usuario</button>
            </div>

            {(() => {
                const subByUser = {};
                subscriptions.forEach(({ subscription: s }) => {
                    if (s.status === 'ACTIVE') subByUser[s.userId] = s;
                });
                return (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Plan</th>
                                    <th>Suscripción</th>
                                    <th>Vence</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => {
                                    const s = subByUser[u.id];
                                    return (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>
                                                {u.username}
                                                {u.id === currentUser?.userId && <span className="badge-you"> (tú)</span>}
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`badge-role ${u.role === 'ADMIN' ? 'badge-admin' : ''}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>{s ? <strong>{s.plan?.name}</strong> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                            <td>
                                                <span className={`badge-status ${s ? 'badge-active' : 'badge-cancelled'}`}>
                                                    {s ? 'Activa' : 'Sin suscripción'}
                                                </span>
                                            </td>
                                            <td>{s?.expiresAt ? new Date(s.expiresAt).toLocaleDateString('es-ES') : '—'}</td>
                                            <td className="admin-actions">
                                                <button className="btn-small btn-edit" onClick={() => openEdit(u)}>Editar</button>
                                                <button
                                                    className="btn-small btn-delete"
                                                    onClick={() => handleDelete(u.id, u.username)}
                                                    disabled={u.id === currentUser?.userId}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
            })()}

            {modal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{modal.mode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}</h2>
                        {formError && <div className="alert alert-error">{formError}</div>}
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required={modal.mode === 'create'}
                                />
                            </div>
                            {modal.mode === 'create' && (
                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Rol</label>
                                <select
                                    value={form.role}
                                    onChange={e => setForm({ ...form, role: e.target.value })}
                                    className="role-select"
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
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
