import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, Package, Heart, LayoutDashboard, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import CartDrawer from "./CartDrawer";
import SupportWidget from "./SupportWidget";

const Navbar = () => {
    const { items, toggleCart } = useCart();
    const { wishlist } = useWishlist();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const isAdmin = user?.role === 'admin';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                        {isAdmin ? "LUMA. Admin" : "LUMA."}
                    </Link>
                    <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                        {!isAdmin && (
                            <>
                                <Link to="/" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
                                <Link to="/" onClick={() => setIsMenuOpen(false)}>Men</Link>
                                <Link to="/" onClick={() => setIsMenuOpen(false)}>Women</Link>
                                <Link to="/" onClick={() => setIsMenuOpen(false)}>Accessories</Link>
                                <Link to="/" className="sale" onClick={() => setIsMenuOpen(false)}>Sale</Link>
                            </>
                        )}
                        {user && (
                            <div className="mobile-user-links">
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
                                {!isAdmin && (
                                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Package size={18} /> My Orders
                                    </Link>
                                )}
                                {isAdmin ? (
                                    <>
                                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <LayoutDashboard size={18} /> Dashboard
                                        </Link>
                                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: '0.5rem 0', color: 'var(--text)' }}>
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/settings" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', overflow: 'hidden' }}>
                                            {user.profilePicture ? (
                                                <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        Settings
                                    </Link>
                                )}
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

                    {!isAdmin && (
                        <>
                            <Link to="/wishlist" className="icon-btn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart size={24} />
                                {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                            </Link>

                            <button className="icon-btn" onClick={toggleCart}>
                                <ShoppingBag size={24} />
                                {items.length > 0 && <span className="badge">{items.length}</span>}
                            </button>
                        </>
                    )}

                    {user ? (
                        <>
                            {!isAdmin && (
                                <Link to="/orders" className="btn-text mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Package size={18} />
                                    My Orders
                                </Link>
                            )}
                            {isAdmin ? (
                                <>
                                    <Link to="/admin" className="btn-text mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                                        <LayoutDashboard size={18} />
                                        Dashboard
                                    </Link>
                                    <button onClick={handleLogout} className="btn-text mobile-hide" style={{ marginLeft: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', color: 'inherit' }}>
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/settings" className="mobile-hide" style={{ marginLeft: "1rem", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '600', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </Link>
                            )}
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

import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Star } from "lucide-react";

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer-container">
                {/* Column 1: Help and Shopping */}
                <div className="footer-column">
                    <h3 className="footer-heading">Help and Shopping</h3>
                    <Link to="/help" className="footer-link">Help Center</Link>
                    <Link to="/delivery" className="footer-link">Delivery</Link>
                    <Link to="/returns" className="footer-link">Returns and complaints</Link>
                    <Link to="/contact" className="footer-link">Contact</Link>
                </div>

                {/* Column 2: About Us */}
                <div className="footer-column">
                    <h3 className="footer-heading">About Us</h3>
                    <Link to="/about" className="footer-link">About the brand</Link>
                    <Link to="/terms" className="footer-link">Store regulations</Link>
                    <Link to="/privacy-policy" className="footer-link">Privacy policy</Link>
                </div>

                {/* Column 3: Contact */}
                <div className="footer-column">
                    <h3 className="footer-heading">Contact</h3>
                    <div className="contact-item">
                        <div className="contact-icon"><Phone size={18} /></div>
                        <div>
                            <div style={{ fontWeight: 600 }}>791 16 16 16</div>
                            <div style={{ fontSize: '0.85rem' }}>Mon-Fri 8:00-18:00</div>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon"><Mail size={18} /></div>
                        <div>bok@luma.com</div>
                    </div>

                    <div className="rating-badge">
                        <div className="stars">
                            <Star size={16} fill="#fbbf24" />
                            <Star size={16} fill="#fbbf24" />
                            <Star size={16} fill="#fbbf24" />
                            <Star size={16} fill="#fbbf24" />
                            <Star size={16} fill="#fbbf24" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>TrustMate</div>
                            <div style={{ fontWeight: 700 }}>4.7/5</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Follow us</h4>
                        <div className="social-icons">
                            <a href="#" className="social-icon"><Facebook size={18} /></a>
                            <a href="#" className="social-icon"><Instagram size={18} /></a>
                            <a href="#" className="social-icon"><Youtube size={18} /></a>
                            <a href="#" className="social-icon"><MapPin size={18} /></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright">&copy; 2024 LUMA. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

const Layout = () => {
    const location = useLocation();
    const hideFooterPaths = ['/orders', '/settings', '/login', '/register', '/checkout', '/cart', '/product', '/wishlist', '/order'];
    const showFooter = !hideFooterPaths.some(path => location.pathname.startsWith(path));

    return (
        <div className="layout">
            <Navbar />
            <CartDrawer />
            <main>
                <Outlet />
            </main>
            {showFooter && <Footer />}
            <SupportWidget />
        </div>
    );
};

export default Layout;
