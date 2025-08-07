"use client"

import React, { type ChangeEvent, type ReactNode, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthService } from "../../utils/auth"
import {
    FaUser,
    FaKey,
    FaExclamationTriangle,
    // FaTimes,
    FaUserEdit,
    FaShieldAlt, FaPassport,
} from "react-icons/fa"
import { MdLocationOn, MdEmail, MdPhone, MdDateRange, MdAccountCircle } from "react-icons/md"



// Custom Button Component
type ButtonProps = {
    children: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    variant?: "primary" | "outline" | "ghost" | "danger" | "custom";
    className?: string;
    type?: "button" | "submit" | "reset";
    [key: string]: any;
}
const Button = ({
    children,
    onClick,
    disabled = false,
    variant = "primary",
    className = "",
    type = "button",
    ...props
}: ButtonProps) => {
    const baseClasses =
        "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

    const variants = {
        primary:
            "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:ring-orange-500",
        outline: "border-2 bg-white hover:bg-gray-50 focus:ring-gray-500",
        ghost: "hover:bg-gray-100 focus:ring-gray-500",
        danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
        custom: "text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:ring-blue-500",
    }

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed transform-none" : ""

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant as keyof typeof variants]} ${disabledClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

// Custom Input Component
type InputProps = {
    label?: ReactNode;
    error?: ReactNode;
    className?: string;
    [key: string]: any;
}
const Input = ({ label, error, className = "", ...props }: InputProps) => {
    return (
        <input
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${className}`}
            {...props}
        />
    )
}

// Custom Label Component
type LabelProps = {
    children: ReactNode;
    htmlFor?: string;
    className?: string;
}
const Label = ({ children, htmlFor, className = "" }: LabelProps) => {
    return (
        <label htmlFor={htmlFor} className={`block text-sm font-semibold text-gray-700 mb-2 ${className}`}>
            {children}
        </label>
    )
}

// Custom Card Components
type CardProps = {
    children: ReactNode;
    className?: string;
}
const Card = ({ children, className = "" }: CardProps) => {
    return <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden ${className}`}>{children}</div>
}
const CardContent = ({ children, className = "" }: CardProps) => {
    return <div className={`p-6 ${className}`}>{children}</div>
}

// Custom Modal Component
type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                {children}
            </div>
        </div>
    )
}

// type ModalHeaderProps = {
//     children: ReactNode;
//     onClose: () => void;
// }
// const ModalHeader = ({ children, onClose }: ModalHeaderProps) => {
//     return (
//         <div className="relative p-6 border-b border-gray-200">
//             {children}
//             <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
//                 <FaTimes className="h-4 w-4" />
//             </button>
//         </div>
//     )
// }

type ModalContentProps = {
    children: ReactNode;
}
const ModalContent = ({ children }: ModalContentProps) => {
    return <div className="p-6">{children}</div>
}

export default function ProfileEditor() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showDeactivateAccount, setShowDeactivateAccount] = useState(false)
    const navigate = useNavigate()

    // Buscar dados do usuário autenticado ao carregar
    useEffect(() => {
        const auth = AuthService.getUserAuth();
        if (!auth || !auth.id) return;
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:5028/api/User/${auth.id}`)
                if (!res.ok) throw new Error("Erro ao buscar usuário")
                const data = await res.json()
                setUser(data)
            } catch (err) {
                // Pode exibir erro se quiser
            }
        }
        fetchUser()
    }, [])

    const handleInputChange = (field: string, value: string) => {
        setUser((prev: any) => ({ ...prev, [field]: value }))
    }

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsLoading(true)
        try {
            const auth = AuthService.getUserAuth();
            if (!auth || !auth.id) throw new Error("Usuário não autenticado");
            const payload = {
                userId: user.userId || auth.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                birthDate: user.birthDate,
                password: user.password || "",
                phone: user.phone,
            }
            const res = await fetch(`http://localhost:5028/api/User/${auth.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error("Erro ao atualizar usuário")
            alert("Perfil atualizado com sucesso!")
        } catch (err) {
            alert("Erro ao atualizar perfil!")
        }
        setIsLoading(false)
    }



    const handleDeactivateAccount = async () => {
        setIsLoading(true)
        try {
            const auth = AuthService.getUserAuth();
            if (!auth || !auth.id) {
                throw new Error("Usuário não autenticado");
            }

            // Fazer a chamada DELETE para desativar a conta
            const response = await axios.delete(`http://localhost:5028/api/User/${auth.id}`);

            if (response.status === 200 || response.status === 204) {
                // Fazer logout do usuário após desativação
                AuthService.logout();

                // Redirecionar para a página inicial ou login
                navigate("/");
            }
        } catch (error) {
            console.error("Erro ao desativar conta:", error);
            alert("Erro ao desativar conta. Tente novamente.");
        } finally {
            setIsLoading(false)
            setShowDeactivateAccount(false)
        }
    }



    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-lg text-gray-600">Carregando dados do usuário...</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-blue-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-2">Editar Perfil de Viagem</h1>
                    <p className="text-orange-100 text-xl">Atualize suas informações pessoais e configurações</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <Card>
                            {/* Profile Header */}
                            <div className="relative h-32 bg-gradient-to-r from-orange-400 to-blue-600 overflow-hidden">
                                <div className="absolute inset-0 bg-blue-600 bg-opacity-20"></div>
                                <div className="relative z-10 p-6 h-full flex items-end">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm -ml-2">
                                            <MdAccountCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-lg ml-3">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-orange-100 ml-3">Membro desde 2022</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <CardContent>
                                <div className="flex flex-col gap-2 ml-4"> {/* gap-10 para espaçamento maior entre os itens */}
                                    <div className="flex items-center gap-2 text-gray-600"> {/* gap-5 para espaçamento maior entre ícone e texto */}
                                        <MdEmail className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm pl-2">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MdPhone className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm pl-2">{user.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MdDateRange className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm pl-2">Nascido em {new Date(user.birthDate).toLocaleDateString("pt-BR")}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaPassport className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm pl-2">Doc: {user.documentNumber}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Status da Conta</span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Ativo
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Travel Stats Card */}
                        <Card className="mt-6">
                            <CardContent>
                                <div className="">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <MdLocationOn className="w-5 h-5 text-blue-600" />
                                            <span className="font-semibold">Históricos de Viagem</span>
                                        </div>

                                    </div>
                                    <div>
                                        <Button
                                            variant="custom"
                                            className="h-12 w-full rounded-[10px] shadow-lg"
                                            style={{ backgroundColor: '#003194' }}
                                            onClick={() => navigate("/travelhistory")}
                                        >
                                            Ver Histórico
                                        </Button>
                                    </div>

                                </div>


                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Edit Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <FaUserEdit className="w-6 h-6 mr-3" style={{ color: '#fff', fill: '#fff' }} />
                                    Informações Pessoais
                                </h2>
                                <p className="text-orange-100 mt-1">Mantenha seus dados sempre atualizados</p>
                            </div>

                            <CardContent className="p-8">
                                <div className="space-y-8">
                                    {/* Personal Details Section */}
                                    <div className="bg-gray-50 rounded-2xl p-6">
                                        <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center">
                                            <FaUser className="w-5 h-5 mr-2 text-orange-500" style={{ color: '#f97316', fill: '#f97316' }} />
                                            Dados Pessoais
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label htmlFor="firstName">Nome</Label>
                                                <Input
                                                    id="firstName"
                                                    label={null}
                                                    error={null}
                                                    value={user.firstName}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("firstName", e.target.value)}
                                                    placeholder="Digite seu nome"
                                                    className="h-12"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">Sobrenome</Label>
                                                <Input
                                                    id="lastName"
                                                    label={null}
                                                    error={null}
                                                    value={user.lastName}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("lastName", e.target.value)}
                                                    placeholder="Digite seu sobrenome"
                                                    className="h-12"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                            <div>
                                                <Label htmlFor="email">E-mail</Label>
                                                <Input
                                                    id="email"
                                                    label={null}
                                                    error={null}
                                                    type="email"
                                                    value={user.email}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                                                    placeholder="Digite seu e-mail"
                                                    className="h-12"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">Telefone</Label>
                                                <Input
                                                    id="phone"
                                                    label={null}
                                                    error={null}
                                                    value={user.phone}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
                                                    placeholder="Digite seu telefone"
                                                    className="h-12"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                            <div>
                                                <Label htmlFor="birthDate">Data de Nascimento</Label>
                                                <Input
                                                    id="birthDate"
                                                    label={null}
                                                    error={null}
                                                    type="date"
                                                    value={user.birthDate ? user.birthDate.slice(0, 10) : ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("birthDate", e.target.value)}
                                                    className="h-12"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="documentNumber">Número do Documento</Label>
                                                <Input
                                                    id="documentNumber"
                                                    label={null}
                                                    error={null}
                                                    value={user.documentNumber}
                                                    disabled
                                                    className="h-12 bg-gray-100 text-gray-500 cursor-not-allowed"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Este campo não pode ser alterado</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Section */}
                                    <div className="bg-gray-50 rounded-2xl p-6">
                                        <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center">
                                            <FaShieldAlt className="w-5 h-5 mr-2 text-orange-500" />
                                            Segurança da Conta
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => navigate("/resetpassclient")}
                                                className="justify-start border-blue-200 hover:bg-blue-50 text-blue-700 py-4 px-6 h-14 text-base"
                                            >
                                                <FaKey className="w-5 h-5 mr-3 text-blue-700" style={{ color: '#2563eb', fill: '#2563eb' }} />
                                                Alterar Senha
                                            </Button>

                                            <Button
                                                variant="outline"
                                                onClick={() => setShowDeactivateAccount(true)}
                                                className="justify-start border-red-200 hover:bg-red-50 text-red-600 py-4 px-6 h-14 text-base"
                                            >
                                                <FaExclamationTriangle className="w-5 h-5 mr-3" style={{ color: '#dc2626', fill: '#dc2626' }} />
                                                Desativar Conta
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="mt-8 pt-8 border-t">
                                    <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full py-6 px-8 text-xl">
                                        {isLoading ? "Salvando Alterações..." : "Salvar Alterações"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>



                {/* Deactivate Account Modal */}
                <Modal isOpen={showDeactivateAccount} onClose={() => setShowDeactivateAccount(false)}>

                    <ModalContent>
                        <div className="space-y-6">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                <div className="flex items-start space-x-4">
                                    <div>
                                        <h3 className="font-bold text-red-800 mb-3">Atenção: Esta ação é irreversível!</h3>
                                        <p className="text-red-700 text-sm leading-relaxed mb-3">
                                            Tem certeza que deseja desativar sua conta? Isso irá:
                                        </p>
                                        <ul className="text-red-700 text-sm space-y-2 list-disc list-inside">
                                            <li>Cancelar todas as reservas ativas</li>
                                            <li>Remover acesso ao histórico de viagens</li>
                                            <li>Excluir suas preferências salvas</li>
                                            <li>Desativar permanentemente sua conta</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-4 mt-4 ">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeactivateAccount(false)}
                                    className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700 h-12"
                                >
                                    Cancelar
                                </Button>
                                <Button variant="danger" onClick={handleDeactivateAccount} disabled={isLoading} className="flex-1 h-12 ml-4">
                                    {isLoading ? "Desativando..." : "Sim, Desativar"}
                                </Button>
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    )
}
