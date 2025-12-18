import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, Package, Settings as SettingsIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
    const { items, toggleCart } = useCart();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <div className="nav-left">
                    <button
                        className="icon-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ display: 'none', marginRight: '1rem' }}
                    >
                        <Menu size={24} />
                        <style>{`
                            @media (max-width: 768px) {
                                .nav-left .icon-btn { display: flex !important; }
                            }
                        `}</style>
                    </button>
                    <Link to="/" className="logo">
                        LUMA.
                    </Link>
                    <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Men</Link>
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Women</Link>
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Accessories</Link>
                        <Link to="/" className="sale" onClick={() => setIsMenuOpen(false)}>Sale</Link>
                        {user && (
                            <div className="mobile-user-links">
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
                                <Link to="/orders" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Package size={18} /> My Orders
                                </Link>
                                <Link to="/settings" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <SettingsIcon size={18} /> Settings
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="nav-actions">
                    <form onSubmit={handleSearch} className="search-bar">
                        <Search size={20} color="#666" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <button className="icon-btn" onClick={toggleCart}>
                        <ShoppingBag size={24} />
                        {items.length > 0 && <span className="badge">{items.length}</span>}
                    </button>

                    {user ? (
                        <>
                            <Link to="/orders" className="btn-text mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package size={18} />
                                My Orders
                            </Link>
                            <Link to="/settings" className="btn-text mobile-hide" style={{ marginLeft: "1rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <SettingsIcon size={18} />
                                Settings
                            </Link>
                        </>
                    ) : (
                        <Link to="/login" className="btn-text">Login</Link>
                    )}
                </div>
            </div>
            <style>{`
                .mobile-user-links {
                    display: none;
                }
                @media (max-width: 768px) {
                    .mobile-hide { display: none !important; }
                    .nav-links.mobile-open {
                        z-index: 1000;
                    }
                    .mobile-user-links {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .mobile-user-links a, .mobile-user-links button {
                        font-size: 1rem;
                        color: var(--text);
                        padding: 0.5rem 0;
                    }
                }
            `}</style>
        </nav>
    );
};

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <p>&copy; 2024 LUMA. All rights reserved.</p>
        </div>
    </footer>
);

const Layout = () => {
    const location = useLocation();
    const hideFooterPaths = ['/orders', '/settings', '/login', '/register', '/checkout', '/cart', '/product'];
    const showFooter = !hideFooterPaths.some(path => location.pathname.startsWith(path));

    return (
        <div className="layout">
            <Navbar />
            <CartDrawer />
            <main>
                <Outlet />
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

export default Layout;
