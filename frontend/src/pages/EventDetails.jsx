import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as eventService from '../services/eventService';
import QRCodeDisplay from '../components/QRCodeDisplay';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await eventService.getById(id);
            setEvent(response.event);
        } catch (err) {
            setError(err.message || 'Error loading event');
        } finally {
            setLoading(false);
        }
    };

    const getStatus = () => {
        if (!event) return { text: 'Necunoscut', class: 'secondary' };

        const now = new Date();
        const start = new Date(event.start_time);
        const end = new Date(event.end_time);

        if (now < start) return { text: 'Programat', class: 'info' };
        if (now >= start && now <= end) return { text: 'În desfășurare', class: 'success' };
        return { text: 'Încheiat', class: 'secondary' };
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('ro-RO', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Se încarcă...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="error-page">
                <h2>Eveniment negăsit</h2>
                <Link to="/" className="btn btn-primary">Înapoi la Dashboard</Link>
            </div>
        );
    }

    const status = getStatus();
    const accessCode = event.accessCode?.code;

    return (
        <div className="event-details-page">
            <div className="page-header">
                <Link to={`/event-groups/${event.group?.id || ''}`} className="back-link">
                    ← Înapoi la evenimente
                </Link>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="event-details-container">
                <div className="event-details-card">
                    <div className="event-header">
                        <h1>{event.title}</h1>
                        <span className={`badge badge-large badge-${status.class}`}>
                            {status.text}
                        </span>
                    </div>

                    <div className="event-info">
                        <div className="info-row">
                            <span className="info-label">Grup:</span>
                            <span className="info-value">{event.group?.title || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Început:</span>
                            <span className="info-value">{formatDateTime(event.start_time)}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Sfârșit:</span>
                            <span className="info-value">{formatDateTime(event.end_time)}</span>
                        </div>
                    </div>

                    <div className="access-code-section">
                        <h2>Cod de acces</h2>
                        <div className="access-code-display">
                            {accessCode || 'Nu există cod de acces'}
                        </div>
                    </div>

                    {accessCode && (
                        <div className="qr-section">
                            <h2>Cod QR</h2>
                            <p className="qr-hint">Scanează codul pentru a confirma prezența</p>
                            <QRCodeDisplay
                                value={`${window.location.origin}/check-in?code=${accessCode}`}
                                size={280}
                                showDownload={true}
                            />
                        </div>
                    )}

                    <div className="event-actions">
                        <Link to={`/events/${event.id}/attendance`} className="btn btn-primary btn-large">
                            Vezi lista de prezență
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
