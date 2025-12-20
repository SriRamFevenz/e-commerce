import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

import type { Product } from "../types";

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const res = await api.get("/users/wishlist");
            setWishlist(res.data);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId: string) => {
        try {
            await api.post(`/users/wishlist/${productId}`);
            fetchWishlist();
        } catch (error) {
            console.error("Failed to add to wishlist", error);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            await api.delete(`/users/wishlist/${productId}`);
            setWishlist((prev) => prev.filter((item) => item._id !== productId));
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((item) => item._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
