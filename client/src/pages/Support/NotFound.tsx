import { Link } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const NotFound = () => {
    useDocumentTitle("Page Not Found");

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center' }}>
            <h1 style={{ fontSize: '6rem', fontWeight: '900', margin: 0, color: 'var(--text-secondary)', opacity: 0.2 }}>404</h1>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2rem' }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/" className="btn">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
