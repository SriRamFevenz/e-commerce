import { useState } from "react";
import api from "../../services/api";
import Notification from "../../components/Notification";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const AdminDashboard = () => {
    useDocumentTitle("Admin Dashboard");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            };

            await api.post("/products", payload);
            setSuccess("Product created successfully!");
            setFormData({
                title: "",
                description: "",
                price: "",
                category: "",
                image: "",
                stock: ""
            });
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create product");
            if (err.response?.data?.errors) {
                // Handle zod errors if present
                const zodErrors = err.response.data.errors.map((e: any) => e.message).join(", ");
                setError(zodErrors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div style={{ maxWidth: "700px", margin: "3rem auto" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text-primary)" }}>Admin Dashboard</h1>

                <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "2rem", color: "var(--text-primary)" }}>Add New Product</h2>

                <Notification message={error} type="error" />
                <Notification message={success} type="success" />

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: "1rem" }}>
                        <label style={{ color: "var(--text-secondary)", fontWeight: "500" }}>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            style={{
                                padding: "0.5rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "4px",
                                width: "100%",
                                maxWidth: "400px",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)"
                            }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "start", gap: "1rem" }}>
                        <label style={{ color: "var(--text-secondary)", fontWeight: "500", marginTop: "0.5rem" }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            style={{
                                padding: "0.5rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "4px",
                                width: "100%",
                                maxWidth: "400px",
                                fontFamily: "inherit",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)"
                            }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: "1rem" }}>
                        <label style={{ color: "var(--text-secondary)", fontWeight: "500" }}>Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            style={{
                                padding: "0.5rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "4px",
                                width: "100%",
                                maxWidth: "400px",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)"
                            }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: "1rem" }}>
                        <label style={{ color: "var(--text-secondary)", fontWeight: "500" }}>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            style={{
                                padding: "0.5rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "4px",
                                width: "100%",
                                maxWidth: "400px",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)"
                            }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: "1rem" }}>
                        <label style={{ color: "var(--text-secondary)", fontWeight: "500" }}>Image URL</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com/image.jpg"
                            style={{
                                padding: "0.5rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "4px",
                                width: "100%",
                                maxWidth: "400px",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)"
                            }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: "1rem" }}>
                        <label style={{ color: "var(--text-secondary)", fontWeight: "500" }}>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            style={{
                                padding: "0.5rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "4px",
                                width: "100%",
                                maxWidth: "400px",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)"
                            }}
                        />
                    </div>

                    <div style={{ marginTop: "2rem" }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                maxWidth: "536px", // Align with inputs (120 + 16 + 400)
                                padding: "1rem",
                                fontSize: "1rem",
                                fontWeight: "600",
                                backgroundColor: "var(--primary)",
                                color: "var(--bg-primary)",
                                border: "none",
                                borderRadius: "0",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? "Creating Product..." : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
