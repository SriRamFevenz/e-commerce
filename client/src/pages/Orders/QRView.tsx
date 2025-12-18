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
                navigate("/orders"); // Redirect to orders list
            }
        } catch (err) {
            // Ignore errors during polling
        }
    };

    return (
        <div className="container" style={{ textAlign: "center" }}>
            <div style={{ textAlign: "left", marginTop: "2rem" }}>
                <GoBackButton style={{ width: "auto", padding: "0.5rem 1rem", marginBottom: "1rem" }} />
            </div>
            <h1>Scan to Pay</h1>
            <Notification message={error} type="error" />
            {qrCode ? (
                <div>
                    <img src={qrCode} alt="Payment QR" style={{ width: "300px" }} />
                    <p>Scan this QR code with your mobile device to pay.</p>
                    {/* For testing purposes, show the link */}
                    <p>
                        <a href={scanUrl} target="_blank" rel="noreferrer">
                            (Simulate Scan Link)
                        </a>
                    </p>
                </div>
            ) : (
                <p>Loading QR...</p>
            )}
        </div>
    );
};

export default QRView;
