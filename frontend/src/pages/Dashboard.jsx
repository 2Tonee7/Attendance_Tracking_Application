import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as eventGroupService from '../services/eventGroupService';
import ExportButtons from '../components/ExportButtons';

const Dashboard = () => {
    const { user } = useAuth();
    const [eventGroups, setEventGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const canManageEvents = user && (user.role === 'organizer' || user.role === 'admin');

    useEffect(() => {
        fetchEventGroups();
    }, []);

    const fetchEventGroups = async () => {
        try {
            const response = await eventGroupService.getAll();
            setEventGroups(response.eventGroups || []);
        } catch (err) {
            setError(err.message || 'Error loading event groups');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Sigur vrei să ștergi acest grup de evenimente?')) return;

        try {
            await eventGroupService.remove(id);
            setEventGroups(eventGroups.filter(group => group.id !== id));
        } catch (err) {
            setError(err.message || 'Error deleting group');
        }
    };

    const getExportColumns = () => [
        { header: 'ID', accessor: (row) => row.id },
        { header: 'Titlu', accessor: (row) => row.title },
        { header: 'Descriere', accessor: (row) => row.description || '' },
        { header: 'Tip recurență', accessor: (row) => row.recurrence_type },
        { header: 'Data început', accessor: (row) => row.start_date || '' },
        { header: 'Data sfârșit', accessor: (row) => row.end_date || '' },
        { header: 'Nr. evenimente', accessor: (row) => row.events?.length || 0 },
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Se încarcă...</p>
            </div>
        );
    }

    if (!canManageEvents) {
        return (
            <div className="dashboard-page">
                <div className="page-header">
                    <h2>Bine ai venit, {user?.full_name}!</h2>
                </div>

                <div className="empty-state">
                    <h3>Ești conectat ca Student</h3>
                    <p>Pentru a confirma prezența la un eveniment, folosește pagina de check-in.</p>
                    <Link to="/check-in" className="btn btn-primary btn-large">
                        Mergi la Check-in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>Dashboard</h2>
                <div className="page-actions">
                    <Link to="/event-groups/new" className="btn btn-primary">
                        + Creează grup de evenimente
                    </Link>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {eventGroups.length > 0 && (
                <div className="export-section">
                    <ExportButtons
                        data={eventGroups}
                        filename="grupuri-evenimente"
                        columns={getExportColumns()}
                    />
                </div>
            )}

            {eventGroups.length === 0 ? (
                <div className="empty-state">
                    <h3>Nu ai niciun grup de evenimente</h3>
                    <p>Creează primul tău grup pentru a începe să gestionezi evenimente.</p>
                    <Link to="/event-groups/new" className="btn btn-primary">
                        Creează grup de evenimente
                    </Link>
                </div>
            ) : (
                <div className="card-grid">
                    {eventGroups.map((group) => (
                        <div key={group.id} className="card">
                            <div className="card-header">
                                <h3>{group.title}</h3>
                                <span className={`badge badge-${group.recurrence_type === 'none' ? 'info' : 'primary'}`}>
                                    {group.recurrence_type === 'none' ? 'Unic' :
                                        group.recurrence_type === 'daily' ? 'Zilnic' :
                                            group.recurrence_type === 'weekly' ? 'Săptămânal' : group.recurrence_type}
                                </span>
                            </div>

                            <div className="card-body">
                                {group.description && (
                                    <p className="card-description">{group.description}</p>
                                )}

                                <div className="card-meta">
                                    {group.start_date && (
                                        <p><strong>Perioada:</strong> {group.start_date} - {group.end_date}</p>
                                    )}
                                    <p><strong>Evenimente:</strong> {group.events?.length || 0}</p>
                                </div>
                            </div>

                            <div className="card-actions">
                                <Link to={`/event-groups/${group.id}`} className="btn btn-primary btn-sm">
                                    Vezi evenimente
                                </Link>
                                <button
                                    onClick={() => handleDelete(group.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Șterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
