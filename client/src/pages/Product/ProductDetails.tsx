import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import Notification from "../../components/Notification";
import { useCart } from "../../context/CartContext";
import GoBackButton from "../../components/GoBackButton";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useWishlist } from "../../context/WishlistContext";
import { Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Product } from "../../types";
import Loading from "../../components/Loading";

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState("");

    const inWishlist = id ? isInWishlist(id) : false;

    const toggleWishlist = async () => {
        if (!id) return;
        if (!user) {
            navigate("/login", { state: { from: location } });
            return;
        }
        if (inWishlist) {
            await removeFromWishlist(id);
        } else {
            await addToWishlist(id);
        }
    };

    const handleBuy = () => {
        if (!product) return;
        if (!user) {
            navigate("/login", { state: { from: location } });
            return;
        }
        addToCart(product);
    };

    useDocumentTitle(product ? product.title : "Product Details");

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            setError("Failed to fetch product");
        }
    };



    if (!product) return <Loading />;

    return (
        <div className="container">
            <div style={{ marginTop: "2rem" }}>
                <GoBackButton style={{ width: "auto", padding: "0.5rem 1rem" }} />
            </div>
            <Notification message={error} type="error" />
            <div className="product-details">
                <img src={product.image} alt={product.title} />
                <div className="info">
                    <h1>{product.title}</h1>
                    <p className="price">${product.price}</p>
                    <p className="description">{product.description}</p>
                    {product.tags && product.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
                            {product.tags.map((tag, index) => (
                                <span key={index} style={{
                                    background: 'var(--bg-secondary)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '16px',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)'
                                }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <p>Stock: {product.stock}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button onClick={handleBuy} disabled={product.stock === 0} className="btn" style={{ flex: 1 }}>
                            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                        <button
                            onClick={toggleWishlist}
                            className="btn-outline"
                            style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: inWishlist ? '#dc2626' : 'var(--border-color)' }}
                        >
                            <Heart
                                size={24}
                                color={inWishlist ? "#dc2626" : "currentColor"}
                                fill={inWishlist ? "#dc2626" : "none"}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
