import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'light' | 'dark';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'sm', color = 'light' }) => {
    const sizeMap = {
        sm: '16px',
        md: '24px',
        lg: '32px'
    };

    const colorMap = {
        light: '#ffffff',
        dark: 'var(--text-primary)'
    };

    return (
        <div
            style={{
                width: sizeMap[size],
                height: sizeMap[size],
                border: `2px solid ${colorMap[color]}`,
                borderBottomColor: 'transparent',
                borderRadius: '50%',
                display: 'inline-block',
                boxSizing: 'border-box',
                animation: 'rotation 1s linear infinite',
            }}
        >
            <style>
                {`
                    @keyframes rotation {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default Spinner;
