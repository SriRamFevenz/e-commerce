import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Notification from "../../components/Notification";
import { useCart } from "../../context/CartContext";
import GoBackButton from "../../components/GoBackButton";

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    stock: number;
}

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState("");

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

    const handleBuy = () => {
        if (!product) return;
        addToCart(product);
    };

    if (!product) return <div>Loading...</div>;

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
                    <p>Stock: {product.stock}</p>
                    <button onClick={handleBuy} disabled={product.stock === 0} className="btn">
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
