import { Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const OrderSuccess = () => {
    useDocumentTitle("Order Confirmed");

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem', color: '#10b981' }}>
                <CheckCircle size={80} />
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Order Confirmed!</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '2.5rem' }}>
                Thank you for your purchase. Your order has been received and is being processed. You will receive an email confirmation shortly.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/orders" className="btn">
                    <Package size={20} style={{ marginRight: '0.5rem' }} />
                    View My Orders
                </Link>
                <Link to="/" className="btn-outline">
                    Continue Shopping
                    <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
