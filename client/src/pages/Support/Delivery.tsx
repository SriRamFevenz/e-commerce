import useDocumentTitle from "../../hooks/useDocumentTitle";
import GoBackButton from "../../components/GoBackButton";
import { Truck, Clock, Globe } from "lucide-react";

const Delivery = () => {
    useDocumentTitle("Delivery & Shipping");

    return (
        <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px" }}>
            <GoBackButton />

            <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", marginTop: "1rem" }}>
                Delivery & Shipping
            </h1>

            <div style={{ display: "grid", gap: "2rem" }}>
                {/* Shipping Methods */}
                <div style={{ background: "var(--bg-secondary)", padding: "2rem", borderRadius: "12px" }}>
                    <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <Truck size={24} /> Shipping Methods
                    </h2>

                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        We offer multiple shipping options depending on your location and
                        order value. Available methods and pricing are shown clearly at
                        checkout before payment.
                    </p>

                    <ul
                        style={{
                            color: "var(--text-secondary)",
                            lineHeight: "1.6",
                            marginTop: "1rem",
                            paddingLeft: "1.5rem",
                        }}
                    >
                        <li>
                            <strong>Standard Shipping:</strong> Typically delivered within
                            3–5 business days after dispatch.
                        </li>
                        <li>
                            <strong>Express Shipping:</strong> Faster delivery options where
                            available, usually 1–2 business days.
                        </li>
                        <li>
                            <strong>Priority / Next-Day Delivery:</strong> Available in select
                            regions only and subject to cutoff times.
                        </li>
                    </ul>
                </div>

                {/* Processing Time */}
                <div style={{ background: "var(--bg-secondary)", padding: "2rem", borderRadius: "12px" }}>
                    <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <Clock size={24} /> Order Processing
                    </h2>

                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        Orders are typically processed within 24–48 business hours after
                        confirmation. Orders placed on weekends or public holidays are
                        processed on the next working day.
                    </p>

                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginTop: "0.75rem" }}>
                        Once your order is shipped, you will receive an email containing
                        tracking details so you can monitor delivery progress.
                    </p>
                </div>

                {/* International Shipping */}
                <div style={{ background: "var(--bg-secondary)", padding: "2rem", borderRadius: "12px" }}>
                    <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <Globe size={24} /> International Shipping
                    </h2>

                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        We ship internationally to selected countries. Delivery times for
                        international orders vary depending on destination, courier
                        services, and customs processing.
                    </p>

                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginTop: "0.75rem" }}>
                        Please note that customs duties, import taxes, or additional fees may
                        apply based on your country’s regulations. These charges are not
                        included in our prices and are the responsibility of the recipient.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Delivery;
