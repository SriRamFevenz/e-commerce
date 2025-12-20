import useDocumentTitle from "../../hooks/useDocumentTitle";
import GoBackButton from "../../components/GoBackButton";

const Terms = () => {
    useDocumentTitle("Terms & Conditions");

    return (
        <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px" }}>
            <GoBackButton />

            <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", marginTop: "1rem" }}>
                Terms & Conditions
            </h1>

            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
                Last updated: December 20, 2024
            </p>

            <div style={{ lineHeight: "1.8", color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: "1.5rem" }}>
                    These Terms & Conditions govern your access to and use of the LUMA.
                    website and services. By accessing or using our platform, you agree to
                    comply with these Terms. If you do not agree, you must not use the
                    Service.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    1. Eligibility & Accounts
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    You must be at least 18 years old (or the legal age in your jurisdiction)
                    to create an account or make a purchase. You are responsible for
                    maintaining the confidentiality of your account credentials and for all
                    activities that occur under your account.
                </p>

                <p style={{ marginBottom: "1.5rem" }}>
                    We reserve the right to suspend or terminate accounts that provide false
                    information, violate these Terms, or engage in fraudulent or abusive
                    behavior.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    2. Products, Pricing & Availability
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    All product descriptions, images, and prices are provided for
                    informational purposes only and are subject to change without notice.
                    We reserve the right to correct errors, inaccuracies, or omissions at
                    any time, including after an order has been placed.
                </p>

                <p style={{ marginBottom: "1.5rem" }}>
                    We do not guarantee that products will always be available. Orders may
                    be canceled or limited at our discretion, including in cases of pricing
                    errors or stock limitations.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    3. Orders & Payments
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    By placing an order, you agree that you are authorized to use the
                    selected payment method. Payments are processed through third-party
                    payment providers, and we do not store full payment details.
                </p>

                <p style={{ marginBottom: "1.5rem" }}>
                    We reserve the right to refuse or cancel orders suspected of fraud,
                    unauthorized transactions, or violations of these Terms.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    4. Shipping, Returns & Refunds
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    Shipping, return, and refund conditions are governed by our Delivery
                    Policy and Return Policy. By placing an order, you agree to those
                    policies in addition to these Terms.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    5. Intellectual Property
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    All content on this platform, including text, graphics, logos, designs,
                    and software, is the property of LUMA. or its licensors and is protected
                    by applicable intellectual property laws. Unauthorized use is strictly
                    prohibited.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    6. Prohibited Use
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    You agree not to misuse the Service, including attempting to gain
                    unauthorized access, interfere with system functionality, scrape
                    content, or use the platform for unlawful purposes.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    7. Limitation of Liability
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    To the maximum extent permitted by law, LUMA. shall not be liable for
                    any indirect, incidental, or consequential damages arising from your
                    use of the Service, including loss of data, revenue, or business
                    opportunities.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    8. Changes to These Terms
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    We reserve the right to modify or update these Terms at any time. Any
                    changes will be effective upon posting. Continued use of the Service
                    after changes are published constitutes acceptance of the updated
                    Terms.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    9. Contact Information
                </h2>

                <p>
                    If you have any questions about these Terms & Conditions, please contact
                    us at <strong>support@luma.com</strong>.
                </p>
            </div>
        </div>
    );
};

export default Terms;
