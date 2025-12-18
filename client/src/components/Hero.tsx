import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero-content">
                <span className="hero-subtitle">New Collection 2024</span>
                <h1>Redefine Your<br />Everyday Style.</h1>
                <p>Discover the latest trends in fashion. Elevate your wardrobe with our premium collection designed for comfort and style.</p>
                <div className="hero-actions">
                    <Link to="/orders" className="btn">Shop Now</Link>
                    <Link to="/orders" className="btn-outline">View Lookbook</Link>
                </div>
            </div>
            <div className="hero-image">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" alt="Fashion Model" />
            </div>
        </div>
    );
};

export default Hero;
