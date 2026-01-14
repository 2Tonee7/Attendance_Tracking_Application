import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as attendanceService from '../services/attendanceService';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ParticipantCheckIn = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [code, setCode] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const scannerRef = useRef(null);
    const html5QrcodeScannerRef = useRef(null);

    useEffect(() => {
        const codeFromUrl = searchParams.get('code');
        if (codeFromUrl) {
            setCode(codeFromUrl.toUpperCase());
        }
    }, [searchParams]);

    useEffect(() => {
        return () => {
            if (html5QrcodeScannerRef.current) {
                html5QrcodeScannerRef.current.clear().catch(console.error);
            }
        };
    }, []);

    useEffect(() => {
        if (showScanner && scannerRef.current && !html5QrcodeScannerRef.current) {
            html5QrcodeScannerRef.current = new Html5QrcodeScanner(
                'qr-reader',
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            html5QrcodeScannerRef.current.render(
                (decodedText) => {
                    setCode(decodedText);
                    setShowScanner(false);
                    if (html5QrcodeScannerRef.current) {
                        html5QrcodeScannerRef.current.clear().catch(console.error);
                        html5QrcodeScannerRef.current = null;
                    }
                    handleSubmit(null, decodedText);
                },
                (error) => { }
            );
        }
    }, [showScanner]);

    const toggleScanner = () => {
        if (showScanner && html5QrcodeScannerRef.current) {
            html5QrcodeScannerRef.current.clear().catch(console.error);
            html5QrcodeScannerRef.current = null;
        }
        setShowScanner(!showScanner);
    };

    const handleSubmit = async (e, scannedCode = null) => {
        if (e) e.preventDefault();

        const accessCode = scannedCode || code;

        if (!accessCode.trim()) {
            setMessage({ type: 'error', text: 'Introdu un cod de acces' });
            return;
        }

        if (!isAuthenticated) {
            setMessage({
                type: 'error',
                text: 'Trebuie să fii autentificat pentru a confirma prezența'
            });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await attendanceService.checkIn(accessCode);
            setMessage({ type: 'success', text: 'Prezența a fost confirmată cu succes!' });
            setCode('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Error confirming attendance' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkin-page">
            <div className="checkin-container">
                <h1>Confirmă prezența</h1>
                <p className="checkin-subtitle">
                    Introdu codul de acces sau scanează codul QR pentru a-ți confirma prezența la eveniment.
                </p>

                {!isAuthenticated && (
                    <div className="alert alert-warning">
                        <p>
                            <strong>Atenție:</strong> Trebuie să fii autentificat pentru a confirma prezența.
                        </p>
                        <div className="alert-actions">
                            <Link
                                to={`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                                className="btn btn-primary btn-sm"
                            >
                                Autentificare
                            </Link>
                            <Link
                                to={`/register?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                                className="btn btn-secondary btn-sm"
                            >
                                Înregistrare
                            </Link>
                        </div>
                    </div>
                )}

                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="checkin-form">
                    <div className="form-group">
                        <label htmlFor="code">Cod de acces</label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Ex: ABC123"
                            disabled={loading}
                            className="code-input"
                            autoComplete="off"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-large"
                        disabled={loading || !isAuthenticated}
                    >
                        {loading ? 'Se confirmă...' : 'Confirmă prezența'}
                    </button>
                </form>

                <div className="divider">
                    <span>sau</span>
                </div>

                <button
                    onClick={toggleScanner}
                    className="btn btn-secondary btn-block"
                    disabled={!isAuthenticated}
                >
                    {showScanner ? 'Închide scanner' : 'Scanează cod QR'}
                </button>

                {showScanner && (
                    <div className="qr-scanner-container">
                        <div id="qr-reader" ref={scannerRef}></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantCheckIn;
