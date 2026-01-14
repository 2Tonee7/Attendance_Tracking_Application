import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as eventGroupService from '../services/eventGroupService';
import * as eventService from '../services/eventService';
import ExportButtons from '../components/ExportButtons';

const EventList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventGroup, setEventGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start_time: '',
        end_time: '',
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchEventGroup();
    }, [id]);

    const fetchEventGroup = async () => {
        try {
            const response = await eventGroupService.getById(id);
            setEventGroup(response.eventGroup);
        } catch (err) {
            setError(err.message || 'Error loading event group');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            await eventService.create({
                group_id: id,
                title: newEvent.title,
                start_time: newEvent.start_time,
                end_time: newEvent.end_time,
            });
            setShowCreateForm(false);
            setNewEvent({ title: '', start_time: '', end_time: '' });
            fetchEventGroup();
        } catch (err) {
            setError(err.message || 'Error creating event');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Sigur vrei să ștergi acest eveniment?')) return;

        try {
            await eventService.remove(eventId);
            fetchEventGroup();
        } catch (err) {
            setError(err.message || 'Error deleting event');
        }
    };

    const getStatus = (event) => {
        const now = new Date();
        const start = new Date(event.start_time);
        const end = new Date(event.end_time);

        if (now < start) return { text: 'Programat', class: 'info' };
        if (now >= start && now <= end) return { text: 'În desfășurare', class: 'success' };
        return { text: 'Încheiat', class: 'secondary' };
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('ro-RO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getExportColumns = () => [
        { header: 'ID', accessor: (row) => row.id },
        { header: 'Titlu', accessor: (row) => row.title },
        { header: 'Data început', accessor: (row) => formatDateTime(row.start_time) },
        { header: 'Data sfârșit', accessor: (row) => formatDateTime(row.end_time) },
        { header: 'Status', accessor: (row) => getStatus(row).text },
        { header: 'Cod acces', accessor: (row) => row.accessCode?.code || '' },
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Se încarcă...</p>
            </div>
        );
    }

    if (!eventGroup) {
        return (
            <div className="error-page">
                <h2>Grup de evenimente negăsit</h2>
                <Link to="/" className="btn btn-primary">Înapoi la Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="event-list-page">
            <div className="page-header">
                <div>
                    <Link to="/" className="back-link">← Înapoi la Dashboard</Link>
                    <h2>{eventGroup.title}</h2>
                    {eventGroup.description && <p className="page-description">{eventGroup.description}</p>}
                </div>
                <div className="page-actions">
                    <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
                        + Adaugă eveniment
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {showCreateForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Adaugă eveniment nou</h3>
                        <form onSubmit={handleCreateEvent}>
                            <div className="form-group">
                                <label htmlFor="event-title">Titlu *</label>
                                <input
                                    type="text"
                                    id="event-title"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="Titlul evenimentului"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="start-time">Data și ora de început *</label>
                                <input
                                    type="datetime-local"
                                    id="start-time"
                                    value={newEvent.start_time}
                                    onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="end-time">Data și ora de sfârșit *</label>
                                <input
                                    type="datetime-local"
                                    id="end-time"
                                    value={newEvent.end_time}
                                    onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-secondary">
                                    Anulează
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={creating}>
                                    {creating ? 'Se adaugă...' : 'Adaugă'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {eventGroup.events?.length > 0 && (
                <div className="export-section">
                    <ExportButtons
                        data={eventGroup.events}
                        filename={`evenimente-${eventGroup.title}`}
                        columns={getExportColumns()}
                    />
                </div>
            )}

            {!eventGroup.events || eventGroup.events.length === 0 ? (
                <div className="empty-state">
                    <h3>Nu există evenimente în acest grup</h3>
                    <p>Adaugă primul eveniment pentru a începe.</p>
                    <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
                        Adaugă eveniment
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Titlu</th>
                                <th>Data început</th>
                                <th>Data sfârșit</th>
                                <th>Status</th>
                                <th>Cod acces</th>
                                <th>Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventGroup.events.map((event) => {
                                const status = getStatus(event);
                                return (
                                    <tr key={event.id}>
                                        <td>{event.title}</td>
                                        <td>{formatDateTime(event.start_time)}</td>
                                        <td>{formatDateTime(event.end_time)}</td>
                                        <td>
                                            <span className={`badge badge-${status.class}`}>
                                                {status.text}
                                            </span>
                                        </td>
                                        <td>
                                            <code className="access-code">{event.accessCode?.code || 'N/A'}</code>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <Link to={`/events/${event.id}`} className="btn btn-sm btn-info">
                                                    QR Code
                                                </Link>
                                                <Link to={`/events/${event.id}/attendance`} className="btn btn-sm btn-primary">
                                                    Prezență
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    Șterge
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EventList;
