import React from "react";
import { FaTimes } from "react-icons/fa";

// Constantes para evitar repetição
const MODAL_OVERLAY_GRADIENT = `linear-gradient(135deg, rgba(0, 49, 148, 0.9), rgba(247, 126, 40, 0.9))`;
const PRIMARY_COLOR = "#003194";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = "max-w-2xl"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay com gradiente */}
            <div
                className="fixed inset-0 bg-opacity-80"
                onClick={onClose}
                style={{
                    background: MODAL_OVERLAY_GRADIENT
                }}
            />

            {/* Container do Modal */}
            <div className={`relative bg-white rounded-2xl w-full ${maxWidth} mx-4 my-8`}>
                {/* Header Fixo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Área com Scroll */}
                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {children}
                </div>

                {/* Footer (se fornecido) */}
                {footer && (
                    <div className="p-6 border-t border-gray-200">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BaseModal;
export { PRIMARY_COLOR };
