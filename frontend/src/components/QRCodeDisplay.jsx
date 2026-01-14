import { QRCodeSVG } from 'qrcode.react';

const QRCodeDisplay = ({ value, size = 200, showDownload = false }) => {
    const handleDownload = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = size;
            canvas.height = size;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `qr-code-${value}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div className="qr-code-container">
            <QRCodeSVG
                id="qr-code-svg"
                value={value}
                size={size}
                level="H"
                includeMargin={true}
            />
            {showDownload && (
                <button onClick={handleDownload} className="btn btn-secondary qr-download-btn">
                    Descarcă QR Code
                </button>
            )}
        </div>
    );
};

export default QRCodeDisplay;
