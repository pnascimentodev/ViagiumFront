import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/img/logo.svg";
import { FaEnvelope } from "react-icons/fa";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button.tsx";
import axios from "axios";

interface EmailProps {
  userType: "client" | "admin" | "affiliate";
}

function Email({ userType }: EmailProps) {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

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

    function handleLogin(e: React.FormEvent) {
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
        // lógica de envio

        let endpoint = "";
        if (userType === "client") endpoint = "/api/User/by-email";
        if (userType === "admin") endpoint = "/api/User/by-email";
        if (userType === "affiliate") endpoint = "/api/affiliate/by-email";

        axios.get(`https://localhost:7259${endpoint}`, { params: { email } })
        .then(response => {
        // Trate o sucesso (ex: navegue, mostre mensagem, etc)
        console.log(response.data);
    })
        .catch(error => {
        // Trate o erro (ex: e-mail não encontrado)
        setEmailError("E-mail não encontrado.");
    });

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
                    <Link to="/forgotpassword">
                        <div className="w-full flex justify-center items-center">
                            <Button
                                className="h-12 w-full mb-15 rounded-[10px] shadow-lg bg-blue-800 text-white font-semibold mt-4"
                                type="button"
                                disabled={!email || !!emailError} 
                            >
                                Avançar
                            </Button>
                        </div>
                    </Link>
                </form>
            </div>
        </div>
    );
}
export default Email;