import React from "react";

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface SidebarProps {
    menuItems: MenuItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, activeTab, onTabChange }) => {
    const PRIMARY_COLOR = "#003194";

    return (
        <div className="w-16 lg:w-64 text-white flex flex-col" style={{ backgroundColor: PRIMARY_COLOR }}>
            {/* Header */}
            <div className="p-6 border-b border-white border-opacity-20 flex items-center justify-center lg:justify-start">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center">
                        <img src="/../src/assets/img/logo.svg" alt="Viagium Logo" className="w-8 h-8" />
                    </div>
                    <span className="text-lg font-semibold text-white ml-3 hidden lg:inline">Admin Viagium</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onTabChange(item.id)}
                                className={`w-full flex items-center justify-center lg:justify-start mb-1 space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium gap-2 ${activeTab !== item.id ? "hover:bg-blue-800 hover:bg-opacity-20" : ""
                                    }`}
                                style={activeTab === item.id ? { backgroundColor: "#f54a00" } : {}}
                            >
                                <span className="min-w-[24px] min-h-[24px] flex items-center justify-center text-[24px]">{item.icon}</span>
                                <span className="text-white hidden lg:inline">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            {/* <div className="p-4 border-t border-white border-opacity-20">
                <button className="w-full flex items-center justify-center lg:justify-start space-x-3 px-4 py-3 text-orange-400 hover:bg-orange-600 hover:text-white rounded-lg transition-colors gap-2">
                    
                    <span className="min-w-[24px] min-h-[24px] flex items-center justify-center text-[24px]"><FaSignOutAlt style={{ color: "white", fill: "white" }} /></span>
                    <span className="text-white hidden lg:inline">Sair</span>
                </button>
            </div> */}
        </div>
    );
};

export default Sidebar;
