
import { Button } from "../../../components/Button.tsx";
import logo from "../../../assets/img/logo.svg";
import { FaEnvelope } from "react-icons/fa";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa"
import { Input } from "../../../components/Input.tsx";
import { useState } from "react";
import axios from "axios";

interface LoginProps {
    userType: "client" | "admin" | "affiliate";
    newUserOption: boolean;
}

async function Login({ userType, newUserOption }: LoginProps) {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function validateEmail(email: string) {
        if (!email || email.trim() === "") {
            return "O e-mail é obrigatório.";
        }
    }

    function validatePassword(password: string): string | null {
        if (!password || password.trim() === "") {
            return "A senha é obrigatória.";
        }
        return null;
    }

    function handleEmailBlur() {
        const errorMessage = validateEmail(email);
        setEmailError(errorMessage || "");
    }

    function handlePasswordBlur() {
        if (!password) {
            setPasswordError("A senha é obrigatória.");
        } else {
            setPasswordError("");
        }
    }

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        let valid = true;

        // Validar email
        const emailValidation = validateEmail(email);
        if (emailValidation) {
            setEmailError(emailValidation);
            valid = false;
        } else {
            setEmailError("");
        }

        // Validar senha
        const passwordValidation = validatePassword(password);
        if (passwordValidation) {
            setPasswordError(passwordValidation);
            valid = false;
        } else {
            setPasswordError("");
        }

        if (!valid) return;

        // chamando o endpoint pra login e autenticação
        let endpoint = "";
        if (userType === "affiliate") endpoint = "https://localhost:7259/api/Affiliate/login";
        if (userType === "client") endpoint = "";
        if (userType === "admin") endpoint = "";


        axios.post(endpoint, { email, password })
        .then(response => {
            console.log("Login bem-sucedido:", response.data);
            // redirecionar ou atualizar estado conforme necessário
        })
        .catch(error => {
            console.error("Erro no login:", error);
            if (error.response) {
            // Erro retornado pela API
            alert(`Erro: ${error.response.data.message || "Falha no login."}`);
            } else {
            // Erro de rede ou outro
            alert("Erro de rede ou servidor indisponível.");
            }
        });

    }

    return (
        <div className="flex flex-col rounded-3xl shadow-lg w-[80vw] md:w-[450px] justify-around bg-white min-h-[500px] py-5 px-10">
            <div className="flex justify-center gap-4 items-center">
                <img src={logo} alt="Logo Viagium" className="h-20" />

                {(userType === "admin" || userType === "affiliate") && (
                    <p className="font-bold text-4xl">{userType === "admin" ? "Admin" : userType === "affiliate" ? "Afiliado" : ""}</p>
                )}

            </div>

            <form className="w-full flex flex-col items-center" onSubmit={handleLogin}>
                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-col justify-center gap-1">
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

                    <div className="flex flex-col justify-center gap-1">
                        <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha atual"
                                    icon={
                                        <span
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {showPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
                                        </span>
                                    }
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onBlur={handlePasswordBlur}
                            hasError={!!passwordError}
                        />
                        {passwordError && (
                            <div className="text-red-500 font-medium">
                                {passwordError}
                            </div>
                        )}
                    </div>

                    <div>
                        <Button
                            className="h-12 w-full rounded-[10px] shadow-lg"
                            type="submit"
                        >
                            ENTRAR
                        </Button>
                    </div>
                </div>
            </form>

            <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center justify-center w-full gap-2">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        className="w-4 h-4 rounded focus:ring-2"
                    />
                    <label
                        htmlFor="rememberMe"
                        className="text-md cursor-pointer select-none"
                    >
                        Mantenha-me conectado
                    </label>
                </div>
                {/* Checkbox "Mantenha-me conectado" */}
                <div className="flex flex-col items-center justify-center gap-2" >

                    {/* Links */}
                            <a
                            href={
                                userType === "client"
                                ? "/emailclient"
                                : userType === "affiliate"
                                ? "/emailaffiliate"
                                : userType === "admin"
                                ? "/forgotpassword" // defina a rota correta para admin
                                : "#"
                            }
                        className="font-bold text-base hover:underline,no-underline transition-all block hover:text-[#FFA62B]"
                    >
                        Esqueceu sua senha?
                    </a>
                    {newUserOption && (
                        <div className="flex flex-col md:flex-row items-center gap-2">
                            <p className="text-center">Não tem conta Viagium? </p>
                            <a
                            href={
                                userType === "client"
                                ? "/register"
                                : userType === "affiliate"
                                ? "/affiliate/register"
                                : "/register"
                            }
                            className="text-base font-bold hover:underline no-underline transition-all block hover:text-[#FFA62B]">
                            Crie sua conta
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}

export default Login;