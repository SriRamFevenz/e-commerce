import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Notification from "../../components/Notification";
import GoBackButton from "../../components/GoBackButton";

const QRView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [qrCode, setQrCode] = useState("");
    const [scanUrl, setScanUrl] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchQR();
        // Poll for status
        const interval = setInterval(checkStatus, 3000);
        return () => clearInterval(interval);
    }, [id]);

    const fetchQR = async () => {
        try {
            const res = await api.get(`/orders/${id}/qr`);
            setQrCode(res.data.qrCodeUrl);
            setScanUrl(res.data.scanUrl);
        } catch (err) {
            setError("Failed to generate QR Code");
        }
    };

    const checkStatus = async () => {
        try {
            // In a real app, we'd have a specific status endpoint, but we can re-use myorders or fetch single order if available
            // For now, let's assume we can fetch the order details
            // Since we don't have a GET /orders/:id endpoint for users (only myorders), let's add one or filter myorders
            // Optimization: Let's just use the scan endpoint which returns status!
            const res = await api.get(`/orders/${id}/scan`);
            if (res.data.status === "paid") {
                navigate("/order-success"); // Redirect to order success page
            }
        } catch (err) {
            // Ignore errors during polling
        }
    };

    return (
        <div className="container" style={{ textAlign: "center", paddingBottom: "4rem" }}>
            <div style={{ textAlign: "left", marginTop: "2rem" }}>
                <GoBackButton style={{ width: "auto", padding: "0.5rem 1rem", marginBottom: "1rem" }} />
            </div>
            <h1>Payment</h1>
            <Notification message={error} type="error" />

            <div style={{ backgroundColor: '#e3f2fd', padding: '1rem', borderRadius: '8px', margin: '1rem 0', border: '1px solid #90caf9' }}>
                <p style={{ margin: 0, color: '#0d47a1' }}>
                    📧 A payment link has also been sent to your email.
                </p>
            </div>

            {qrCode ? (
                <div>
                    <img src={qrCode} alt="Payment QR" style={{ width: "300px" }} />
                    <p>Scan this QR code with your mobile device to pay.</p>

                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <p style={{ margin: 0, color: '#666' }}>Testing this on desktop?</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href={scanUrl} className="btn" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                                Pay Now
                            </a>
                            <button onClick={() => navigate('/orders')} className="btn-outline">
                                Pay Later
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading QR...</p>
            )}
        </div>
    );
};

export default QRView;
