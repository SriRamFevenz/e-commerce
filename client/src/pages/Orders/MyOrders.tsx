import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Notification from "../../components/Notification";
import GoBackButton from "../../components/GoBackButton";
import { Clock, CheckCircle, ArrowRight, CreditCard } from "lucide-react";

interface Order {
    _id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders/myorders");
            setOrders(res.data);
        } catch (err) {
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div className="orders-container">
            <div style={{ marginBottom: "2rem" }}>
                <GoBackButton style={{ width: "auto", padding: "0.5rem 1rem" }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>My Orders</h1>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Track and manage your recent purchases</p>
                </div>
                <div style={{ background: 'var(--secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '600' }}>
                    {orders.length} Orders
                </div>
            </div>

            <Notification message={error} type="error" />

            {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", background: 'var(--secondary)', borderRadius: '16px' }}>
                    <div style={{ marginBottom: '1.5rem', color: 'var(--text-light)' }}>
                        <CreditCard size={48} strokeWidth={1} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No orders yet</h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Looks like you haven't placed any orders yet.</p>
                    <Link to="/" className="btn">Start Shopping</Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order, index) => (
                        <div
                            key={order._id}
                            className="order-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="order-header">
                                <div>
                                    <div className="order-id">#{order._id.slice(-8).toUpperCase()}</div>
                                    <div className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div className={`status-badge ${order.status}`}>
                                    {order.status === 'paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                    {order.status}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount</div>
                                    <div className="order-amount">${order.totalAmount.toFixed(2)}</div>
                                </div>

                                <div className="order-actions">
                                    {order.status !== "paid" ? (
                                        <Link to={`/order/${order._id}/qr`} className="pay-btn">
                                            Pay Now <ArrowRight size={16} />
                                        </Link>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                            <CheckCircle size={16} color="#166534" />
                                            Payment Completed
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
