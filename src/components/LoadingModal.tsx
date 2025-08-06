import React from "react";
import Plane from "../assets/img/plane.svg";
import Cloud from "../assets/img/cloud.svg";

interface LoadingModalProps {
    isOpen: boolean;
}

const breathingAnimation1 = {
    animation: "breathing 4s ease-in-out infinite",
};

const breathingAnimation2 = {
    animation: "breathing 2s ease-in-out infinite",
};

const keyframes = `
@keyframes breathing {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-16px) scale(1.08); }
}
@keyframes dotFade {
  0% { opacity: 0; }
  20% { opacity: 1; }
  100% { opacity: 0; }
}
`;

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-20">
            {/* Inline keyframes */}
            <style>{keyframes}</style>
            <div className="flex flex-col items-center w-64 gap-10">
                <div>
                    <div style={{ transform: "translateX(-30px) translateY(30px)" }} className="w-30 flex items-center justify-center">
                        <div style={breathingAnimation1} >
                            <img src={Cloud} />
                        </div>
                    </div>
                    <div style={{ transform: "translateX(20px)" }} className="w-30 flex items-center justify-center">
                        <div style={breathingAnimation2} className="flex items-center justify-center">
                            <img src={Plane} />
                        </div>
                    </div>
                </div>
                <span className="mt-4 text-2xl font-bold flex items-center">
                    Carregando
                    <span style={{ display: "inline-flex", marginLeft: 4 }}>
                        <span
                            style={{
                                animation: "dotFade 1.2s infinite",
                                animationDelay: "0s",
                                opacity: 0,
                            }}
                        >.</span>
                        <span
                            style={{
                                animation: "dotFade 1.2s infinite",
                                animationDelay: "0.3s",
                                opacity: 0,
                            }}
                        >.</span>
                        <span
                            style={{
                                animation: "dotFade 1.2s infinite",
                                animationDelay: "0.6s",
                                opacity: 0,
                            }}
                        >.</span>
                    </span>
                </span>
            </div>
        </div>
    );
};

export default LoadingModal;