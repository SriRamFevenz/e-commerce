import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface GoBackButtonProps {
    style?: React.CSSProperties;
}

const GoBackButton = ({ style }: GoBackButtonProps) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: '0.5rem',
                marginBottom: '1rem',
                fontSize: '1rem',
                borderRadius: '8px',
                background: 'transparent',
                color: '#666',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...style
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.color = '#666';
                e.currentTarget.style.transform = 'translateX(0)';
            }}
        >
            <ArrowLeft size={24} />
        </button>
    );
};

export default GoBackButton;
