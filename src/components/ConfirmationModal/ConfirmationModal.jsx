import './ConfirmationModal.css'
import { useEffect } from 'react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="modal-button confirm" onClick={onConfirm}>
                        نعم
                    </button>
                    <button className="modal-button cancel" onClick={onClose}>
                        الغاء
                    </button>
                </div>
            </div>
        </div>
    );
}