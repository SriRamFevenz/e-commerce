import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Notification from "../../components/Notification";
import { ShieldCheck, CreditCard, CheckCircle } from "lucide-react";
import GoBackButton from "../../components/GoBackButton";
import useDocumentTitle from "../../hooks/useDocumentTitle";

import Loading from "../../components/Loading";

const PaymentPage = () => {
    useDocumentTitle("Payment");
    const { token } = useParams();
    const [order, setOrder] = useState<{ amount: number; status: string } | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        try {
            const res = await api.get(`/orders/validate-token/${token}`);
            setOrder(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid or expired payment link");
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async () => {
        try {
            await api.post(`/orders/pay-token/${token}`);
            setSuccess("Payment Successful!");
            setOrder((prev) => prev ? { ...prev, status: "paid" } : null);
        } catch (err: any) {
            setError(err.response?.data?.message || "Payment Failed");
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error && !success) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: "center", maxWidth: '400px' }}>
                    <div style={{ color: '#dc2626', marginBottom: '1rem' }}>
                        <ShieldCheck size={48} />
                    </div>
                    <h2 style={{ marginBottom: '1rem' }}>Link Expired or Invalid</h2>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>This secure payment link is no longer valid. Please generate a new QR code from your order history.</p>
                    <Notification message={error} type="error" />
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: 'var(--bg-secondary)', flexDirection: 'column' }}>
            <div style={{ width: '100%', maxWidth: '450px', marginBottom: '1rem' }}>
                <GoBackButton />
            </div>
            <div style={{
                background: 'var(--bg-primary)',
                padding: '3rem',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                width: '100%',
                maxWidth: '450px',
                textAlign: 'center',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        background: 'var(--primary)',
                        color: 'var(--bg-primary)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        {success ? <CheckCircle size={32} /> : <CreditCard size={32} />}
                    </div>
                    <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
                        {success ? 'Payment Complete' : 'Secure Checkout'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={14} /> Encrypted & Secure
                    </p>
                </div>

                <Notification message={success} type="success" />

                {order && (
                    <div>
                        <div style={{ margin: '2.5rem 0', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <p style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount</p>
                            <p className="price" style={{ fontSize: '3rem', margin: 0, fontWeight: '800', color: 'var(--text-primary)' }}>
                                ${order.amount.toFixed(2)}
                            </p>
                        </div>

                        {!success && (
                            <>
                                <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                        <span>Order Status</span>
                                        <span style={{ fontWeight: '600', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{order.status}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                        <span>Payment Method</span>
                                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Secure QR Link</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePay}
                                    className="btn"
                                    style={{
                                        width: "100%",
                                        padding: '1rem',
                                        fontSize: '1.1rem',
                                        borderRadius: '8px',
                                        background: 'var(--primary)',
                                        color: 'var(--bg-primary)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    Pay Now
                                </button>
                            </>
                        )}

                        {success && (
                            <p style={{ color: "#666", marginTop: "1.5rem" }}>
                                You can now close this window.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;
