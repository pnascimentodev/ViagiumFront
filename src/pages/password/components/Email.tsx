import { useState } from "react";
import logo from "../../../assets/img/logo.svg";
import { FaEnvelope } from "react-icons/fa";
import { Input } from "../../../components/Input.tsx";
import { Button } from "../../../components/Button.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface EmailProps {
  userType: "client" | "affiliate";
}

function Email({ userType }: EmailProps) {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [backendError, setBackendError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    function validateEmail(email: string) {
        if (!email || email.trim() === "") {
            return "O e-mail é obrigatório.";
        }
        return "";
    }

    function handleEmailBlur() {
        const errorMessage = validateEmail(email);
        setEmailError(errorMessage || "");
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        let valid = true;

        const emailValidation = validateEmail(email);
        if (emailValidation) {
            setEmailError(emailValidation);
            valid = false;
        } else {
            setEmailError("");
        }

        if (!valid) return;

        let endpoint = "";
        if (userType === "client") endpoint = "/api/User/forgot-password-email";
        if (userType === "affiliate") endpoint = "/api/Affiliate/by-email";

        try {
            if (userType === "client") {
                await axios.post(`http://localhost:5028${endpoint}`, email, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else if (userType === "affiliate") {
                await axios.get(`http://localhost:5028${endpoint}`, { params: { email } });
            }
            setBackendError("");
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                if (userType === "affiliate") {
                    navigate("/forgotpassaffiliate");
                }
            }, 2000); // Exibe animação por 2 segundos
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            let message = err.response?.data?.message || "Erro ao buscar e-mail.";
            message = message.replace(/^Erro ao buscar e-mail:\s*/, "");
            setBackendError(message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[linear-gradient(to_bottom,rgba(0,49,148,0.9),#fff),url('https://images.pexels.com/photos/13644895/pexels-photo-13644895.jpeg')]">
            <div className="flex flex-col rounded-3xl shadow-lg w-[80vw] md:w-[450px] justify-around bg-[#FFFFFF] min-h-[500px] py-5 px-10">
                <div className="flex flex-col justify-center items-center gap-1 mb-6">
                    <div className="flex justify-center gap-3 items-center">
                        <img src={logo} alt="Logo Viagium" className="h-20" />
                        <p className="font-semibold text-2xl">Redefinição de senha</p>
                    </div>
                    <p className="text-center mt-6">Crie uma nova senha para acessar sua conta</p>
                </div>
                <form className="w-full flex flex-col mb-12" onSubmit={handleLogin}>
                    <div className="flex flex-col justify-center gap-1">
                        <label className="font-semibold mb-1" htmlFor="email-input">
                            E-mail
                        </label>
                        <Input
                            type="email"
                            placeholder="Email"
                            icon={<FaEnvelope size={16} />}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onBlur={handleEmailBlur}
                            hasError={!!emailError}
                        />
                        {emailError && (
                            <div className="text-red-500 font-medium">
                                {emailError}
                            </div>
                        )}
                    </div>
                    {/* Mensagem de erro do backend */}
                    {backendError && (
                        <div className="text-red-500 text-center text-sm font-semibold mb-2">{backendError}</div>
                    )}

                    {/* Mensagem de sucesso com animação */}
                    {showSuccess && (
                        <div className="flex flex-col items-center justify-center mb-4 animate-bounce">
                            <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-600 font-bold text-lg">E-mail verificado com sucesso!</span>
                        </div>
                    )}
                    <div className="w-full flex justify-center items-center">
                        <Button
                            className="h-12 w-full mb-15 rounded-[10px] shadow-lg bg-blue-800 text-white font-semibold mt-4"
                            type="submit"
                            disabled={!email || !!emailError} 
                        >
                            Avançar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Email;