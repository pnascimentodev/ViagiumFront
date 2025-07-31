import { useState } from "react";
import logo from "../../../assets/img/logo.svg";
import { FaEnvelope } from "react-icons/fa";
import { Input } from "../../../components/Input.tsx";
import { Button } from "../../../components/Button.tsx";
import axios from "axios";


interface EmailProps {
  userType: "client" | "affiliate";
}

function Email({ userType }: EmailProps) {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [backendError, setBackendError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

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
        if (userType === "affiliate") endpoint = "/api/Affiliate/forgot-password";

        try {
            if (userType === "client") {
                await axios.post(`http://localhost:5028${endpoint}`, email, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else if (userType === "affiliate") {
                await axios.post(`http://localhost:5028${endpoint}`, email, {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            setBackendError("");
            setShowSuccess(true);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            let message = err.response?.data?.message || "Erro ao buscar e-mail.";
            message = message.replace(/^Erro ao buscar e-mail:\s*/, "");
            setBackendError(message);
            setShowSuccess(false); // Garante que mensagem de sucesso não aparece junto com erro
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

                    <div className="w-full flex justify-center items-center">
                        <Button
                            className="h-12 w-full mb-5 rounded-[10px] shadow-lg bg-blue-800 text-white font-semibold mt-4"
                            type="submit"
                            disabled={!email || !!emailError} 
                        >
                            Avançar
                        </Button>
                    </div>

                    {/* Mensagem de erro do backend */}
                    {backendError && !showSuccess && (
                        <div className="text-red-500 text-center text-md font-semibold">{backendError}</div>
                    )}

                    {/* Mensagem de sucesso sem animação */}
                    {showSuccess && !backendError && (
                        <div className="flex flex-col items-center justify-center mb-4">
                            <span className="text-green-600 font-bold text-md">E-mail enviado com sucesso, verifique sua caixa de mensagens.</span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Email;