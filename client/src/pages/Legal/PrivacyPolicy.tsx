import useDocumentTitle from "../../hooks/useDocumentTitle";
import GoBackButton from "../../components/GoBackButton";

const PrivacyPolicy = () => {
    useDocumentTitle("Privacy Policy");

    return (
        <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px" }}>
            <GoBackButton />

            <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", marginTop: "1rem" }}>
                Privacy Policy
            </h1>

            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
                Last updated: December 20, 2024
            </p>

            <div style={{ lineHeight: "1.8", color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: "1.5rem" }}>
                    At <strong>LUMA.</strong>, we respect your privacy and are committed to
                    protecting your personal information. This Privacy Policy explains what
                    data we collect, how we use it, and the choices you have regarding your
                    information when you use our website or services.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Information We Collect
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    We collect information you provide directly to us, including but not
                    limited to your name, email address, phone number, billing and shipping
                    details, and any information you submit through forms or account creation.
                </p>

                <p style={{ marginBottom: "1.5rem" }}>
                    We may also automatically collect certain technical data such as your IP
                    address, browser type, device information, pages visited, and usage
                    patterns to help us understand how our platform is used.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    How We Use Your Information
                </h2>

                <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
                    <li>To provide, operate, and maintain our services</li>
                    <li>To process transactions and manage user accounts</li>
                    <li>To communicate important updates, support messages, or service notices</li>
                    <li>To improve functionality, performance, and user experience</li>
                    <li>To detect, prevent, and respond to fraud or security issues</li>
                </ul>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Cookies & Tracking Technologies
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    We use cookies and similar technologies to enhance your browsing
                    experience, analyze site traffic, and understand user behavior. You can
                    control or disable cookies through your browser settings, but some
                    features may not function properly if you do so.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Third-Party Services
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    We may use trusted third-party services such as analytics providers,
                    payment processors, or hosting services. These third parties only access
                    information necessary to perform their functions and are required to
                    protect your data.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Data Security
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    We implement reasonable technical and organizational measures to protect
                    your personal data. However, no method of transmission over the internet
                    or electronic storage is 100% secure, and we cannot guarantee absolute
                    security.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Data Retention
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    We retain personal information only for as long as necessary to fulfill
                    the purposes outlined in this policy, unless a longer retention period
                    is required or permitted by law.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Your Rights
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    Depending on your location, you may have rights to access, correct,
                    delete, or restrict the use of your personal data. You may also withdraw
                    consent for marketing communications at any time.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Changes to This Policy
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    We may update this Privacy Policy from time to time. Any changes will be
                    reflected on this page with an updated revision date.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Contact Us
                </h2>

                <p>
                    If you have any questions or concerns about this Privacy Policy, contact
                    us at <strong>privacy@luma.com</strong>.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
