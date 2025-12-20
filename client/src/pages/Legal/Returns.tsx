import useDocumentTitle from "../../hooks/useDocumentTitle";
import GoBackButton from "../../components/GoBackButton";

const Returns = () => {
    useDocumentTitle("Return Policy");

    return (
        <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px" }}>
            <GoBackButton />

            <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", marginTop: "1rem" }}>
                Return Policy
            </h1>

            <div style={{ lineHeight: "1.8", color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: "1.5rem" }}>
                    We aim to provide high-quality products and a smooth shopping experience.
                    If you are not satisfied with your purchase, you may be eligible to
                    request a return under the conditions outlined below.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Eligibility for Returns
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    Items must be returned in unused, unworn condition, with original
                    packaging and tags intact. Returns that show signs of use, damage, or
                    alteration may be rejected.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Return Window
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    Return requests must be submitted within <strong>30 days</strong> of the
                    delivery date. Requests submitted after this period may not be accepted.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    How to Request a Return
                </h2>

                <ol style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
                    <li style={{ marginBottom: "0.5rem" }}>
                        Access your order details through your account or order confirmation email.
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                        Submit a return request with the reason for return.
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                        Follow the instructions provided once your request is approved.
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                        Securely package the item to prevent damage during transit.
                    </li>
                </ol>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Refunds
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    Once the returned item is received and inspected, approved refunds are
                    processed within <strong>5–7 business days</strong>. Refunds are issued to
                    the original payment method used at checkout.
                </p>

                <p style={{ marginBottom: "1.5rem" }}>
                    Shipping charges, handling fees, and any applicable duties are
                    non-refundable unless the return is due to an error on our part.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Non-Returnable Items
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                    Certain items may be non-returnable, including clearance items, digital
                    products, gift cards, or products marked as final sale. Any such
                    exclusions will be clearly stated on the product page.
                </p>

                <h2 style={{ color: "var(--text-primary)", marginTop: "2rem", marginBottom: "1rem" }}>
                    Exchanges
                </h2>

                <p>
                    We do not currently offer direct exchanges. If you require a different
                    size, color, or variant, please return the original item (if eligible)
                    and place a new order.
                </p>
            </div>
        </div>
    );
};

export default Returns;
