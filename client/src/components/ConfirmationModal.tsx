import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    children?: React.ReactNode;
    disabled?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDanger = false,
    children,
    disabled = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title" style={{ color: isDanger ? '#dc2626' : undefined }}>
                        {title}
                    </h3>
                </div>
                <div className="modal-body">
                    {message && <p>{message}</p>}
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="btn-outline" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button
                        className="btn"
                        onClick={onConfirm}
                        disabled={disabled}
                        style={{
                            backgroundColor: isDanger ? '#dc2626' : undefined,
                            borderColor: isDanger ? '#dc2626' : undefined,
                            opacity: disabled ? 0.5 : 1,
                            cursor: disabled ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
