import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Notification from "../../components/Notification";
import GoBackButton from "../../components/GoBackButton";

interface OrderStatus {
    amount: number;
    status: string;
}

const ScanPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<OrderStatus | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        const fetchOrderDetails = async () => {
            try {
                const res = await api.get<OrderStatus>(`/orders/${id}/scan`);
                if (!cancelled) setOrder(res.data);
            } catch {
                if (!cancelled) setError("Invalid QR Code");
            }
        };

        fetchOrderDetails();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const handlePay = async () => {
        if (!id || !order) return;
        try {
            await api.post(`/orders/${id}/pay`);
            setSuccess("Payment Successful!");
            setOrder({ ...order, status: "paid" });
        } catch {
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
