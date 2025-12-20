import useDocumentTitle from "../../hooks/useDocumentTitle";
import GoBackButton from "../../components/GoBackButton";

const About = () => {
    useDocumentTitle("About Us");

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
            <GoBackButton />
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', marginTop: '1rem' }}>About Us</h1>

            <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Welcome to <strong>LUMA.</strong>, your premier destination for modern fashion and lifestyle essentials. Established in 2024, we set out with a simple mission: to make high-quality, sustainable fashion accessible to everyone.
                </p>

                <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Our Story</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    What started as a small passion project has grown into a global community of style enthusiasts. We believe that fashion is more than just clothing—it's a form of self-expression. Our curated collections are designed to empower you to look and feel your best, every single day.
                </p>

                <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Our Values</h2>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Quality:</strong> We never compromise on materials or craftsmanship.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Sustainability:</strong> We are committed to reducing our environmental footprint through eco-friendly practices.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Inclusivity:</strong> Fashion is for everyone. We offer a wide range of sizes and styles to suit diverse bodies and tastes.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Transparency:</strong> We believe in honest pricing and ethical sourcing.</li>
                </ul>

                <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Join Our Journey</h2>
                <p>
                    We're just getting started. Follow us on social media to stay updated on our latest drops, behind-the-scenes content, and community events. Thank you for choosing LUMA.
                </p>
            </div>
        </div>
    );
};

export default About;
