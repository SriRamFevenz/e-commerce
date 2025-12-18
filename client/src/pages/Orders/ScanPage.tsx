import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Notification from "../../components/Notification";
import GoBackButton from "../../components/GoBackButton";

const ScanPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<{ amount: number; status: string } | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const res = await api.get(`/orders/${id}/scan`);
            setOrder(res.data);
        } catch (err) {
            setError("Invalid QR Code");
        }
    };

    const handlePay = async () => {
        if (!order) return;
        try {
            await api.post(`/orders/${id}/pay`, { amount: order.amount });
            setSuccess("Payment Successful!");
            setOrder({ ...order, status: "paid" });
        } catch (err) {
            setError("Payment Failed");
        }
    };

    if (!order) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ textAlign: "center", maxWidth: "400px" }}>
            <div style={{ textAlign: "left" }}>
                <GoBackButton />
            </div>
            <h1>Payment</h1>
            <Notification message={error} type="error" />
            <Notification message={success} type="success" />

            <div className="product-card">
                <h2>Total Amount</h2>
                <p className="price">${order.amount}</p>
                <p>Status: {order.status}</p>

                {order.status !== "paid" && (
                    <button onClick={handlePay} className="btn" style={{ width: "100%" }}>
                        Pay Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default ScanPage;
