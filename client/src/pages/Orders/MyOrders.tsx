import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Notification from "../../components/Notification";
import GoBackButton from "../../components/GoBackButton";
import { Clock, CheckCircle, ArrowRight, CreditCard } from "lucide-react";
import useDocumentTitle from "../../hooks/useDocumentTitle";

import type { Order } from "../../types";
import Loading from "../../components/Loading";

const MyOrders = () => {
    useDocumentTitle("My Orders");
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



    if (loading) return <Loading />;

    return (
        <div className="orders-container">
            <div style={{ marginBottom: "2rem" }}>
                <GoBackButton style={{ width: "auto", padding: "0.5rem 1rem" }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>My Orders</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Track and manage your recent purchases</p>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '600', border: '1px solid var(--border-color)' }}>
                    {orders.length} Orders
                </div>
            </div>

            <Notification message={error} type="error" />

            {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        <CreditCard size={48} strokeWidth={1} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No orders yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't placed any orders yet.</p>
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
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount</div>
                                    <div className="order-amount">${order.totalAmount.toFixed(2)}</div>
                                </div>

                                <div className="order-actions">
                                    {order.status !== "paid" ? (
                                        <Link to={`/order/${order._id}/qr`} className="pay-btn">
                                            Pay Now <ArrowRight size={16} />
                                        </Link>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
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
