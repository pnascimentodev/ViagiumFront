import { useState } from "react";
import { Input } from "../../../components/Input.tsx";
import { Button } from "../../../components/Button.tsx";
import logo from "../../../assets/img/logo.svg";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa"; // Adicione o FaRegEye

interface ForgotProps {
    actualPassword: boolean;
}

function Password({actualPassword}: ForgotProps) {
        // Estado para senha atual
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    // Estados para nova senha
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Estados para confirmação
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function validateCurrentPassword(currentPassword: string) {
        if (!currentPassword || currentPassword.trim() === "") {
            return "A senha é obrigatória.";
        }
         return "";
    }

    function handleCurrentPasswordBlur() {
        const errorMessage = validateCurrentPassword(currentPassword);
        setCurrentPasswordError(errorMessage);
        if (errorMessage) {
            setCurrentPasswordError(errorMessage);
        } else {
            setCurrentPasswordError("");
        }
    }

    function validatePassword(newPassword: string) {
        if (!newPassword || newPassword.trim() === "") {
            return "A senha é obrigatória.";
        }
        if (newPassword.length < 8) {
            return "A Senha deve ser maior que 8 caracteres";
        }
        if (!/[A-Z]/.test(newPassword)) {
            return "A senha deve conter pelo menos uma letra maiúscula.";
        }
        if (!/[a-z]/.test(newPassword)) {
            return "A senha deve conter pelo menos uma letra minúscula.";
        }
        if (!/[0-9]/.test(newPassword)) {
            return "A senha deve conter pelo menos um número.";
        }
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(newPassword)) {
            return "A senha deve conter pelo menos um caractere especial.";
        }
        return "";
    }

    function handlePasswordBlur() {
        const errorMessage = validatePassword(newPassword);
        setNewPasswordError(errorMessage);
        if (errorMessage) {
            setConfirmPasswordError(errorMessage);
        } else if (confirmPassword !== newPassword) {
            setConfirmPasswordError("As senhas não coincidem.");
        } else {
            setConfirmPasswordError("");
        }
    }

    function validateConfirmPassword(confirmPassword: string) {
        if (!confirmPassword || confirmPassword.trim() === "") {
            return "A confirmação da senha é obrigatória.";
        }
        if (confirmPassword !== newPassword) {
            return "As senhas não coincidem.";
        }
        return "";
    }

    function handleConfirmPasswordBlur() {
        const errorMessage = validateConfirmPassword(confirmPassword);
        if (errorMessage) {
            setConfirmPasswordError(errorMessage);
        } else if (confirmPassword !== newPassword) {
            setConfirmPasswordError(errorMessage);
        } else {
            setConfirmPasswordError("");
        }
    }

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        let valid = true;

        const passwordValidation = validatePassword(newPassword);
        if (passwordValidation) {
            setNewPasswordError(passwordValidation);
            valid = false;
        } else if (newPassword !== confirmPassword) {
            setNewPasswordError("As senhas não coincidem.");
            valid = false;
        } else {
            setNewPasswordError("");
        }
        const confirmPasswordValidation = validateConfirmPassword(confirmPassword);
        if (confirmPasswordValidation) {
            setConfirmPasswordError(confirmPasswordValidation);
            valid = false;
        } else {
            setConfirmPasswordError("");
        }
        
        const currentPasswordValidation = validateCurrentPassword(currentPassword);
        if (currentPasswordValidation) {
            setCurrentPasswordError(currentPasswordValidation);
            valid = false;
        } else {
            setCurrentPasswordError("");
        }

        if (!valid) return;

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
                <form className="w-full flex flex-col items-center mb-12" onSubmit={handleLogin}>
                    <div className="w-full flex flex-col gap-3">
                        {actualPassword && (
                            <div className="flex flex-col justify-center gap-1">
                                <label className="font-semibold mb-1" htmlFor="current-password-input">
                                    Senha atual
                                </label>
                                <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Digite sua senha atual"
                                    icon={
                                        <span
                                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {showCurrentPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
                                        </span>
                                    }
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    onBlur={handleCurrentPasswordBlur}
                                    hasError={!!currentPasswordError}
                                />
                                {currentPasswordError && (
                                    <div className="text-red-500 font-medium">
                                        {currentPasswordError}
                                </div>
                            )}
                            </div>
                        )}

                        <div className="flex flex-col justify-center gap-1">
                            <label className="font-semibold mb-1" htmlFor="new-password-input">
                                Nova senha
                            </label>
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Digite sua nova senha"
                                icon={
                                    <span
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {showNewPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
                                    </span>
                                }
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                onBlur={handlePasswordBlur}
                                hasError={!!newPasswordError}
                            />
                            {newPasswordError && (
                                <div className="text-red-500 font-medium">
                                    {newPasswordError}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center gap-1">
                            <label className="font-semibold mb-1" htmlFor="confirm-password-input">
                                Confirme nova senha
                            </label>
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirme sua nova senha"
                                icon={
                                    <span
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {showConfirmPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
                                    </span>
                                }
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                onBlur={handleConfirmPasswordBlur}
                                hasError={!!confirmPasswordError}
                            />
                            {confirmPasswordError && (
                                <div className="text-red-500 font-medium">
                                    {confirmPasswordError}
                                </div>
                            )}
                        </div>

                        <div>
                            <Button
                                className="h-12 w-full rounded-[10px] shadow-lg"
                                type="submit"
                            >
                                Alterar senha
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Password;