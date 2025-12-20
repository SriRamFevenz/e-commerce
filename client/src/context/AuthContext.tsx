import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

import type { User } from "../types";

interface AuthContextType {
    user: User | null;
    login: () => Promise<void>;
    logout: () => void;
    updateUser: (userData: User) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/users/profile");
            setUser(res.data);
        } catch (error) {
            // console.error("Failed to fetch profile", error);
            // Silent fail if not logged in
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        await fetchProfile();
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            setUser(null);
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    const updateUser = (userData: User) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
