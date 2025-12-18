import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Notification from "../../components/Notification";
import GoBackButton from "../../components/GoBackButton";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState("");
    const message = location.state?.message;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            await login(res.data.token);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <GoBackButton />
            <h2>Login</h2>
            <Notification message={message} type="success" />
            <Notification message={error} type="error" />
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
};

export default Login;
