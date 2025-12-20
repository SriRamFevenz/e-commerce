import { useState } from 'react';
import { MessageCircle, X, Mail, HelpCircle, MessageSquare } from 'lucide-react';

const SupportWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {isOpen && (
                <div style={{
                    marginBottom: '1rem',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    minWidth: '200px',
                    animation: 'slideUp 0.2s ease-out'
                }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>Help & Support</h4>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>How can we help you?</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <a href="#" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-primary)', transition: 'background 0.2s' }} className="support-link">
                            <MessageSquare size={18} /> Chat with us
                        </a>
                        <a href="mailto:support@luma.com" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-primary)', transition: 'background 0.2s' }} className="support-link">
                            <Mail size={18} /> Email Support
                        </a>
                        <a href="/help" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-primary)', transition: 'background 0.2s' }} className="support-link">
                            <HelpCircle size={18} /> FAQ
                        </a>
                    </div>
                </div>
            )}

            <button
                onClick={toggleOpen}
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .support-link:hover {
                    background-color: var(--bg-secondary);
                }
            `}</style>
        </div>
    );
};

export default SupportWidget;
