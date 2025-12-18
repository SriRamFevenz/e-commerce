import { X, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

const CartDrawer = () => {
    const { isOpen, toggleCart, items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setLoading(true);
        try {
            const orderItems = items.map((item) => ({
                product: item.id,
                quantity: item.quantity,
            }));

            const res = await api.post("/orders", { items: orderItems });

            clearCart();
            toggleCart();
            navigate(`/order/${res.data._id}/qr`);
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="cart-overlay" onClick={toggleCart} />
            <div className="cart-drawer">
                <div className="cart-header">
                    <h2>Cart</h2>
                    <button className="icon-btn" onClick={toggleCart}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items">
                    {items.length === 0 ? (
                        <p className="empty-cart">Your cart is empty.</p>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.title} />
                                <div className="item-details">
                                    <h4>{item.title}</h4>
                                    <p>${item.price}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.id, -1)}>
                                            <Minus size={16} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="total">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        className="btn checkout-btn"
                        disabled={items.length === 0 || loading}
                        onClick={handleCheckout}
                    >
                        {loading ? "Processing..." : "Checkout"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
