import useDocumentTitle from "../../hooks/useDocumentTitle";
import GoBackButton from "../../components/GoBackButton";
import { Truck, RotateCcw, MessageCircle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Help = () => {
    useDocumentTitle("Help Center");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I track my order?",
            answer: "Once your order ships, you will receive an email with a tracking number. You can also view your order status in the 'My Orders' section of your account."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and our secure QR code payment system."
        },
        {
            question: "Can I change or cancel my order?",
            answer: "Orders can be modified or cancelled within 1 hour of placement. Please contact our support team immediately if you need to make changes."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to over 50 countries. Shipping costs and times vary by location. Please check our Delivery page for more details."
        },
        {
            question: "How do I return an item?",
            answer: "You can request a return from your account dashboard within 30 days of delivery. Visit our Returns page for our full policy and instructions."
        }
    ];

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
            <GoBackButton />
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <HelpCircle size={40} /> Help Center
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
                Find answers to common questions or get in touch with our support team.
            </p>

            {/* Quick Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                <Link to="/delivery" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="help-card" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', transition: 'transform 0.2s' }}>
                        <Truck size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Delivery</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Shipping options & times</p>
                    </div>
                </Link>
                <Link to="/returns" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="help-card" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', transition: 'transform 0.2s' }}>
                        <RotateCcw size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Returns</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Policy & instructions</p>
                    </div>
                </Link>
                <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="help-card" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', transition: 'transform 0.2s' }}>
                        <MessageCircle size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Contact Us</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Get direct support</p>
                    </div>
                </Link>
            </div>

            {/* FAQs */}
            <h2 style={{ marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqs.map((faq, index) => (
                    <div key={index} style={{ background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden' }}>
                        <button
                            onClick={() => toggleFaq(index)}
                            style={{
                                width: '100%',
                                padding: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '1.1rem',
                                fontWeight: '500'
                            }}
                        >
                            {faq.question}
                            {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {openFaq === index && (
                            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Help;
