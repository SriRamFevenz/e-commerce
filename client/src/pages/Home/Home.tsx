import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useLocation } from "react-router-dom";
import Notification from "../../components/Notification";
import Hero from "../../components/Hero";

interface Product {
    _id: string;
    title: string;
    price: number;
    image: string;
}

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState("");
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get("search");
        fetchProducts(searchQuery);
    }, [location.search]);

    const fetchProducts = async (search?: string | null) => {
        try {
            const url = search ? `/products?search=${encodeURIComponent(search)}` : "/products";
            const res = await api.get(url);
            setProducts(res.data);
        } catch (err) {
            setError("Failed to fetch products");
        }
    };

    return (
        <div>
            <Hero />
            <div className="container">
                <h2 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    {new URLSearchParams(location.search).get("search")
                        ? `Search Results for "${new URLSearchParams(location.search).get("search")}"`
                        : "All Products"
                    }
                </h2>
                <Notification message={error} type="error" />

                {products.length === 0 && !error ? (
                    <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-light)" }}>
                        <h3>No products found</h3>
                        <p>Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                <img src={product.image} alt={product.title} />
                                <h3>{product.title}</h3>
                                <p>${product.price}</p>
                                <Link to={`/product/${product._id}`} className="btn">
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
