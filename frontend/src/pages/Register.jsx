import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('participant');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const redirectUrl = searchParams.get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!fullName.trim() || !email.trim() || !password.trim()) {
            setError('Toate câmpurile sunt obligatorii');
            return;
        }

        if (password !== confirmPassword) {
            setError('Parolele nu se potrivesc');
            return;
        }

        if (password.length < 6) {
            setError('Parola trebuie să aibă cel puțin 6 caractere');
            return;
        }

        setLoading(true);

        try {
            await authService.register(fullName, email, password, role);
            await login(email, password);
            navigate(redirectUrl, { replace: true });
        } catch (err) {
            setError(err.message || 'Registration error');
        } finally {
            setLoading(false);
        }
    };

    const loginLink = redirectUrl !== '/'
        ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
        : '/login';

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Înregistrare</h2>
                <p className="auth-subtitle">Creează un cont pentru a accesa aplicația</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="role">Tip cont</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={loading}
                        >
                            <option value="participant">Student / Participant</option>
                            <option value="organizer">Organizator / Profesor</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName">Nume complet</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ion Popescu"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemplu@email.com"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parolă</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmă parola</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={loading}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Se înregistrează...' : 'Înregistrare'}
                    </button>
                </form>

                <p className="auth-footer">
                    Ai deja cont? <Link to={loginLink}>Autentifică-te</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
