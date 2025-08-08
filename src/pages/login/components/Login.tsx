import { Button } from "../../../components/Button.tsx";
import logo from "../../../assets/img/logo.svg";
import { FaEnvelope } from "react-icons/fa";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa"
import { Input } from "../../../components/Input.tsx";
import { useState } from "react";
import axios from "axios";
import { AuthService } from "../../../utils/auth";

interface LoginProps {
    userType: "client" | "admin" | "affiliate";
    newUserOption: boolean;
}

function Login({ userType, newUserOption }: LoginProps) {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // Estados para mensagens de feedback
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
        // Limpar mensagens de feedback quando o usuário começar a digitar
        if (errorMessage || successMessage) {
            setErrorMessage("");
            setSuccessMessage("");
        }
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
        // Limpar mensagens de feedback quando o usuário começar a digitar
        if (errorMessage || successMessage) {
            setErrorMessage("");
            setSuccessMessage("");
        }
    }

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        
        // Limpar mensagens anteriores
        setSuccessMessage("");
        setErrorMessage("");
        
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

        if (!valid) {
            setErrorMessage("Por favor, corrija os erros no formulário.");
            return;
        }

        setIsLoading(true);

        // chamando o endpoint pra login e autenticação
        let endpoint = "";
        if (userType === "affiliate") endpoint = "https://viagium.azurewebsites.net/api/Affiliate/login";
        if (userType === "client") endpoint = "https://viagium.azurewebsites.net/api/User/auth";
        if (userType === "admin") endpoint = "https://viagium.azurewebsites.net/api/User/auth";

        axios.post(endpoint, { email, password })
        .then(response => {
            console.log("Login bem-sucedido:", response.data);
            
            // Exibir mensagem de sucesso
            const userTypeText = userType === "client" ? "Cliente" : 
                                userType === "admin" ? "Administrador" : "Afiliado";
            setSuccessMessage(`Bem-vindo, ${userTypeText}! Redirecionando...`);

            // Salvar dados e token no localStorage usando AuthService
            if (userType === "affiliate") {
                // Salva os dados de autenticação do afiliado
                AuthService.setAffiliateAuth({
                    id: response.data.id,
                    token: response.data.token
                });
                
                // Aguardar um pouco para mostrar a mensagem antes de redirecionar
                setTimeout(() => {
                    window.location.href = "/affiliatedashboard";
                }, 1500);
            }

            if (userType === "client" || userType === "admin") {
                // Salva os dados de autenticação do usuário/admin
                AuthService.setUserAuth({
                    id: response.data.id,
                    token: response.data.token
                });

                // Aguardar um pouco para mostrar a mensagem antes de redirecionar
                setTimeout(() => {
                    if (userType === "client") {
                        window.location.href = "/";
                    }
                    if (userType === "admin") {
                        window.location.href = "/admindashboard";
                    }
                }, 1500);
            }
        })
        .catch(error => {
            console.error("Erro no login:", error);
            if (error.response) {
                // Erro retornado pela API
                const errorMsg = error.response.data.message || "Falha no login.";
                setErrorMessage(`Erro: ${errorMsg}`);
            } else {
                // Erro de rede ou outro
                setErrorMessage("Erro de rede ou servidor indisponível.");
            }
        })
        .finally(() => {
            setIsLoading(false);
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
                            onChange={handleEmailChange}
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
                            onChange={handlePasswordChange}
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
                            disabled={isLoading}
                        >
                            {isLoading ? "ENTRANDO..." : "ENTRAR"}
                        </Button>
                    </div>

                    {/* Mensagens de feedback */}
                    {(successMessage || errorMessage) && (
                        <div className="w-full mt-3">
                            {successMessage && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">{successMessage}</span>
                                </div>
                            )}
                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">{errorMessage}</span>
                                </div>
                            )}
                        </div>
                    )}
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