import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../services/socket";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import Hero from "../../components/Hero";
import Loading from "../../components/Loading";

import type { Product } from "../../types";

interface Category {
    name: string;
    count: number;
}

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const searchQuery = new URLSearchParams(location.search).get("search");
    const category = new URLSearchParams(location.search).get("category") ?? "all";

    // Category selection lives in the URL so filtered views are shareable
    const setCategoryParam = (value: string) => {
        const params = new URLSearchParams(location.search);
        if (value === "all") {
            params.delete("category");
        } else {
            params.set("category", value);
        }
        navigate({ search: params.toString() });
    };

    const fetchProducts = useCallback(async (search?: string | null, cat?: string) => {
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (cat && cat !== "all") params.set("category", cat);
            const qs = params.toString();
            const res = await api.get<Product[]>(`/products${qs ? `?${qs}` : ""}`);
            setProducts(res.data);
            setError("");
        } catch {
            setError("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get<Category[]>("/products/categories");
            setCategories(res.data);
        } catch {
            // Non-critical - category bar just stays empty
        }
    }, []);

    // Refetch whenever the URL (search/category) changes
    useEffect(() => {
        fetchProducts(searchQuery, category);
    }, [fetchProducts, searchQuery, category]);

    // Initial category load
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Real-time: any product change (create/update/delete/stock) refreshes the view
    useEffect(() => {
        const onChange = () => {
            fetchProducts(searchQuery, category);
            fetchCategories();
        };
        socket.on("products:changed", onChange);
        return () => {
            socket.off("products:changed", onChange);
        };
    }, [fetchProducts, fetchCategories, searchQuery, category]);

    if (loading && products.length === 0) return <Loading />;

    return (
        <div>
            <Hero />
            <div className="container">
                <h2 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    {searchQuery
                        ? `Search Results for "${searchQuery}"`
                        : category !== "all"
                            ? `${category}`
                            : "All Products"
                    }
                </h2>
                <Notification message={error} type="error" />

                {/* Category filter */}
                {categories.length > 0 && (
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                        <button
                            className={`btn-outline${category === "all" ? " active" : ""}`}
                            style={{
                                padding: "0.4rem 1rem",
                                borderRadius: "999px",
                                fontSize: "0.9rem",
                                ...(category === "all"
                                    ? { background: "var(--primary)", color: "var(--bg-primary)", borderColor: "var(--primary)" }
                                    : {}),
                            }}
                            onClick={() => setCategoryParam("all")}
                        >
                            All Products
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                className="btn-outline"
                                style={{
                                    padding: "0.4rem 1rem",
                                    borderRadius: "999px",
                                    fontSize: "0.9rem",
                                    ...(category.toLowerCase() === cat.name.toLowerCase()
                                        ? { background: "var(--primary)", color: "var(--bg-primary)", borderColor: "var(--primary)" }
                                        : {}),
                                }}
                                onClick={() => setCategoryParam(cat.name)}
                            >
                                {cat.name} ({cat.count})
                            </button>
                        ))}
                    </div>
                )}

                {products.length === 0 && !error ? (
                    <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-light)" }}>
                        <h3>No products found</h3>
                        <p>Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="product-card"
                                style={product.stock === 0 ? { filter: 'grayscale(100%)', opacity: 0.7 } : {}}
                            >
                                <img src={product.image} alt={product.title} />
                                <h3>{product.title}</h3>
                                <p>${product.price}</p>
                                {product.stock === 0 ? (
                                    <button className="btn" disabled style={{ cursor: 'not-allowed', backgroundColor: '#ccc' }}>
                                        Out of Stock
                                    </button>
                                ) : (
                                    <Link to={`/product/${product._id}`} className="btn">
                                        View Details
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
