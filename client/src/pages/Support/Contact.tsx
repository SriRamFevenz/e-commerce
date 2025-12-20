import useDocumentTitle from "../../hooks/useDocumentTitle";
import GoBackButton from "../../components/GoBackButton";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

const Contact = () => {
    useDocumentTitle("Contact Us");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
            <GoBackButton />
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', marginTop: '1rem' }}>Contact Us</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                <div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                        Have a question or feedback? We'd love to hear from you. Fill out the form below or reach out to us directly via email or phone.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Email</h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>support@luma.com</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Phone</h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>+1 (555) 123-4567</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Office</h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>123 Fashion Ave, New York, NY 10001</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Send us a message</h2>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <h3 style={{ color: '#10b981' }}>Message Sent!</h3>
                            <p>We'll get back to you as soon as possible.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Name</label>
                                <input type="text" className="form-input" required placeholder="Your name" />
                            </div>
                            <div>
                                <label className="form-label">Email</label>
                                <input type="email" className="form-input" required placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="form-label">Message</label>
                                <textarea className="form-input" rows={4} required placeholder="How can we help?" style={{ resize: 'vertical' }}></textarea>
                            </div>
                            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
                                Send Message <Send size={18} style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Contact;
