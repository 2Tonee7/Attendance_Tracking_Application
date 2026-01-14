import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as eventService from '../services/eventService';
import * as attendanceService from '../services/attendanceService';
import ExportButtons from '../components/ExportButtons';

const AttendanceMonitor = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastUpdate, setLastUpdate] = useState(new Date());

    const fetchData = useCallback(async () => {
        try {
            const [eventResponse, attendanceResponse] = await Promise.all([
                eventService.getById(id),
                attendanceService.getEventAttendees(id),
            ]);
            setEvent(eventResponse.event);
            setAttendances(attendanceResponse.attendances || []);
            setLastUpdate(new Date());
            setError('');
        } catch (err) {
            setError(err.message || 'Error loading data');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('ro-RO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getExportColumns = () => [
        { header: 'Nr.', accessor: (row, index) => index + 1 },
        { header: 'Nume', accessor: (row) => row.User?.full_name || 'N/A' },
        { header: 'Email', accessor: (row) => row.User?.email || 'N/A' },
        { header: 'Data și ora check-in', accessor: (row) => formatDateTime(row.checked_in_at) },
        { header: 'Dispozitiv', accessor: (row) => row.device_info || 'N/A' },
    ];

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

    return (
        <div className="attendance-page">
            <div className="page-header">
                <div>
                    <Link to={`/event-groups/${event.group?.id || ''}`} className="back-link">
                        ← Înapoi la evenimente
                    </Link>
                    <h2>Prezență: {event.title}</h2>
                    <p className="page-description">
                        Actualizat automat la fiecare 5 secunde • Ultima actualizare: {formatDateTime(lastUpdate)}
                    </p>
                </div>
                <div className="page-actions">
                    <Link to={`/events/${id}`} className="btn btn-secondary">
                        Vezi QR Code
                    </Link>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-value">{attendances.length}</div>
                    <div className="stat-label">Total participanți</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {event.accessCode?.code || 'N/A'}
                    </div>
                    <div className="stat-label">Cod de acces</div>
                </div>
            </div>

            {attendances.length > 0 && (
                <div className="export-section">
                    <ExportButtons
                        data={attendances}
                        filename={`prezenta-${event.title}-${new Date().toISOString().split('T')[0]}`}
                        columns={getExportColumns()}
                    />
                </div>
            )}

            {attendances.length === 0 ? (
                <div className="empty-state">
                    <h3>Niciun participant încă</h3>
                    <p>Participanții vor apărea aici după ce scanează codul QR sau introduc codul de acces.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nr.</th>
                                <th>Nume</th>
                                <th>Email</th>
                                <th>Data și ora check-in</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendances.map((attendance, index) => (
                                <tr key={attendance.id}>
                                    <td>{index + 1}</td>
                                    <td>{attendance.User?.full_name || 'N/A'}</td>
                                    <td>{attendance.User?.email || 'N/A'}</td>
                                    <td>{formatDateTime(attendance.checked_in_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendanceMonitor;
