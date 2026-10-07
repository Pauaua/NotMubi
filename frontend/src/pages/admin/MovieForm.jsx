import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const CULT_LEVELS = ['LEGENDARY', 'SO_BAD_IT_IS_GOOD', 'HIDDEN_GEM', 'GUILTY_PLEASURE'];
const VIDEO_PROVIDERS = ['YOUTUBE', 'VIMEO', 'SELF_HOSTED'];

const EMPTY_FORM = {
    title: '',
    year: new Date().getFullYear(),
    director: '',
    cultLevel: 'LEGENDARY',
    rating: 5.0,
    synopsis: '',
    videoUrl: '',
    videoProvider: 'YOUTUBE',
    thumbnailUrl: '',
    durationMinutes: 90
};

export default function MovieForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            loadMovie();
        }
    }, [id]);

    const loadMovie = async () => {
        try {
            const response = await api.get(`/api/movies/${id}`);
            setForm({
                ...EMPTY_FORM,
                ...response.data
            });
        } catch (err) {
            setError('No se pudo cargar la película');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'year' || name === 'durationMinutes'
                ? parseInt(value) || 0
                : name === 'rating'
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (isEdit) {
                await api.put(`/api/movies/${id}`, form);
            } else {
                await api.post('/api/movies', form);
            }
            navigate('/admin/movies');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Cargando...</div>;

    return (
        <div className="container">
            <Link to="/admin/movies" className="back-link">← Volver al panel</Link>

            <h1 className="page-title">
                {isEdit ? 'Editar película' : 'Nueva película'}
            </h1>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="movie-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Título *</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group form-group-small">
                        <label>Año *</label>
                        <input
                            type="number"
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Director</label>
                    <input
                        type="text"
                        name="director"
                        value={form.director || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Nivel de culto *</label>
                        <select
                            name="cultLevel"
                            value={form.cultLevel}
                            onChange={handleChange}
                            required
                        >
                            {CULT_LEVELS.map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group form-group-small">
                        <label>Rating (0-10)</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            name="rating"
                            value={form.rating}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group form-group-small">
                        <label>Duración (min)</label>
                        <input
                            type="number"
                            name="durationMinutes"
                            value={form.durationMinutes || 0}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Sinopsis</label>
                    <textarea
                        name="synopsis"
                        value={form.synopsis || ''}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>

                <h3 className="form-section-title">Video</h3>

                <div className="form-row">
                    <div className="form-group">
                        <label>URL del video</label>
                        <input
                            type="text"
                            name="videoUrl"
                            value={form.videoUrl || ''}
                            onChange={handleChange}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>
                    <div className="form-group form-group-small">
                        <label>Proveedor</label>
                        <select
                            name="videoProvider"
                            value={form.videoProvider}
                            onChange={handleChange}
                        >
                            {VIDEO_PROVIDERS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>URL de miniatura (opcional)</label>
                    <input
                        type="text"
                        name="thumbnailUrl"
                        value={form.thumbnailUrl || ''}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                </div>

                {form.videoUrl && form.videoProvider === 'YOUTUBE' && (
                    <div className="video-preview">
                        <p className="preview-label">Vista previa:</p>
                        <iframe
                            width="100%"
                            height="315"
                            src={extractYouTubeEmbed(form.videoUrl)}
                            title="Preview"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                )}

                <div className="form-actions">
                    <Link to="/admin/movies" className="btn-secondary">Cancelar</Link>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear película'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function extractYouTubeEmbed(url) {
    if (!url) return '';
    let videoId = '';
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    const embedMatch = url.match(/embed\/([^?]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);

    if (watchMatch) videoId = watchMatch[1];
    else if (embedMatch) videoId = embedMatch[1];
    else if (shortMatch) videoId = shortMatch[1];

    return `https://www.youtube.com/embed/${videoId}`;
}