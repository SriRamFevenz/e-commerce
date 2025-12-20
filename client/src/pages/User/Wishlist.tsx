import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useWishlist } from "../../context/WishlistContext";
import Loading from "../../components/Loading";

const Wishlist = () => {
    useDocumentTitle("My Wishlist");

    const { wishlist, removeFromWishlist, loading } = useWishlist();



    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem', minHeight: '70vh' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={32} color="#dc2626" fill="#dc2626" /> My Wishlist
            </h1>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <Heart size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem', opacity: 0.5 }} />
                    <h2 style={{ marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Save items you love to your wishlist and review them later.
                    </p>
                    <Link to="/" className="btn">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="product-grid">
                    {wishlist.map((item) => (
                        <div key={item._id} className="product-card">
                            <Link to={`/product/${item._id}`}>
                                <img src={item.image} alt={item.title} />
                            </Link>
                            <h3>{item.title}</h3>
                            <p>${item.price}</p>
                            <button
                                className="btn-outline"
                                style={{ marginTop: '0.5rem', width: '100%', borderColor: '#dc2626', color: '#dc2626' }}
                                onClick={() => removeFromWishlist(item._id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
