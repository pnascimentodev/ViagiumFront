import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../utils/auth";

interface AdminData {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    documentNumber: string;
    birthDate: string;
    phone: string;
}

interface HeaderProps {
    activeTab: string;
    adminData?: AdminData | null;
}

const Header: React.FC<HeaderProps> = ({ activeTab, adminData }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.clearUserAuth();
        navigate('/admin');
    };
    const getTabTitle = (tabId: string) => {
        switch (tabId) {
            case "dashboard": return "Dashboard";
            case "pacotes": return "Gerenciar Pacotes";
            case "afiliados": return "Gerenciar Afiliados";
            case "hoteis": return "Gerenciar Hotéis";
            case "clientes": return "Gerenciar Clientes";
            case "usuarios": return "Gerenciar Usuários Adm";
            default: return "";
        }
    };

    return (
        <header className="text-white p-4 sm:p-6" style={{ background: `linear-gradient(to right, #003194, #b17449ff)` }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                        {getTabTitle(activeTab)}
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="text-left sm:text-right min-w-0 flex-1 sm:flex-none">
                            <p className="text-blue-100 text-sm sm:text-base truncate">
                                Bem-vindo, {adminData ? `${adminData.firstName} ${adminData.lastName}` : 'Admin'}
                            </p>
                            {adminData && (
                                <p className="text-blue-200 text-xs sm:text-sm truncate">{adminData.email}</p>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-1 bg-[#f54a00] hover:bg-red-700 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md transition-colors duration-200 text-xs sm:text-sm flex-shrink-0"
                            title="Sair do sistema"
                        >
                            <FaSignOutAlt style={{ color: "white", fill: "white" }} className="w-3 h-3" />
                            <span className="hidden sm:inline text-white">Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
