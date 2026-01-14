import { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const redirectUrl = location.state?.from || searchParams.get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Email și parola sunt obligatorii');
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
            navigate(redirectUrl, { replace: true });
        } catch (err) {
            setError(err.message || 'Authentication error');
        } finally {
            setLoading(false);
        }
    };

    const registerLink = redirectUrl !== '/'
        ? `/register?redirect=${encodeURIComponent(redirectUrl)}`
        : '/register';

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Autentificare</h2>
                <p className="auth-subtitle">Conectează-te pentru a confirma prezența</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
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

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Se autentifică...' : 'Autentificare'}
                    </button>
                </form>

                <p className="auth-footer">
                    Nu ai cont? <Link to={registerLink}>Înregistrează-te</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
