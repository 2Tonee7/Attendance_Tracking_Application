import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as eventGroupService from '../services/eventGroupService';

const CreateEventGroup = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        recurrence_type: 'none',
        start_date: '',
        end_date: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Titlul este obligatoriu');
            return;
        }

        if (formData.recurrence_type !== 'none') {
            if (!formData.start_date || !formData.end_date) {
                setError('Data de început și de sfârșit sunt obligatorii pentru evenimente recurente');
                return;
            }
            if (new Date(formData.start_date) > new Date(formData.end_date)) {
                setError('Data de început trebuie să fie înainte de data de sfârșit');
                return;
            }
        }

        setLoading(true);

        try {
            await eventGroupService.create(formData);
            navigate('/', { state: { message: 'Grup de evenimente creat cu succes!' } });
        } catch (err) {
            setError(err.message || 'Error creating event group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <div className="form-container">
                <h2>Creează grup de evenimente</h2>
                <p className="form-subtitle">Completează detaliile pentru noul grup de evenimente</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Titlu *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: Curs Programare Web"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descriere</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descrierea grupului de evenimente"
                            rows="3"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="recurrence_type">Tip recurență</label>
                        <select
                            id="recurrence_type"
                            name="recurrence_type"
                            value={formData.recurrence_type}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="none">Unic (fără recurență)</option>
                            <option value="daily">Zilnic</option>
                            <option value="weekly">Săptămânal</option>
                        </select>
                    </div>

                    {formData.recurrence_type !== 'none' && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="start_date">Data de început *</label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="end_date">Data de sfârșit *</label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
                            Anulează
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Se creează...' : 'Creează grup'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventGroup;
