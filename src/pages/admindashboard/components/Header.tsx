import React from "react";

interface HeaderProps {
    activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
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
        <header className="text-white p-6" style={{ background: `linear-gradient(to right, #003194, #b17449ff)` }}>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">
                        {getTabTitle(activeTab)}
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-blue-100">Bem-vindo, Admin</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
