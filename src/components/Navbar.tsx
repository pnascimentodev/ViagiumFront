
import { useEffect, useState } from "react";
import logo from "../assets/img/logo.svg";
import { FaUser, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../utils/auth";

// Interface para os dados do usuário
interface UserData {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    documentNumber: string;
    birthDate: string;
    phone: string;
}


// Tipo para cada link
type NavLink = {
    label: string;
    href: string;
    external?: boolean;
};

// Tipos possíveis de listas de navegação
type NavType = 'default' | 'affiliatePage' | 'admin';

// Props do componente Navbar
interface NavbarProps {
    navType?: NavType;
}

function Navbar({ navType = 'default' }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Listas de links
    const navLinksDefault: NavLink[] = [
        { label: 'Pacotes', href: '/#pacotes' },
        { label: 'Vantagens', href: '/#vantagens' },
        { label: 'Parceiros', href: '/#parceiros' },
        { label: 'Área do afiliado', href: '/affiliatepage' },
        { label: 'Sobre Nós', href: '/aboutus' },
    ];
    const navLinksAffiliate: NavLink[] = [
        { label: 'Vantagens', href: '/affiliatepage#vantagens' },
        { label: 'Nossos Parceiros', href: '/affiliatepage#nossos-parceiros' },
        { label: 'Cadastre-se', href: '/affiliatepage#cadastre-se' },
        { label: 'Sobre Nós', href: '/aboutus' },
    ];
    const navLinksAdmin: NavLink[] = [
        { label: 'Painel', href: '/admin' },
        { label: 'Usuários', href: '/admin/users' },
        { label: 'Relatórios', href: '/admin/reports' },
        { label: 'Sair', href: '/logout' },
    ];

    // Seleciona a lista de links conforme a prop
    let navLinks: NavLink[];
    switch (navType) {
        case 'affiliatePage':
            navLinks = navLinksAffiliate;
            break;
        case 'admin':
            navLinks = navLinksAdmin;
            break;
        case 'default':
        default:
            navLinks = navLinksDefault;
    }

    // Função para buscar dados do usuário na API
    const fetchUserData = async (userId: string) => {
        try {
            const token = AuthService.getUserToken();
            const response = await fetch(`http://localhost:5028/api/User/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data: UserData = await response.json();
                setUserData(data);
            } else {
                console.error('Erro ao buscar dados do usuário:', response.statusText);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    // Função para fazer logout
    const handleLogout = () => {
        AuthService.clearUserAuth();
        setUserData(null);
        setUserMenuOpen(false);
        setMenuOpen(false);
        navigate('/');
    };

    // Renderização dos links
    const renderLinks = () => (
        <>
            {navLinks.map((link, idx) =>
                link.external ? (
                    <a
                        key={idx}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-orange-300 transition-colors duration-200 whitespace-nowrap font-medium text-lg"
                    >
                        {link.label}
                    </a>
                ) : (
                    <a
                        key={idx}
                        href={link.href}
                        className="hover:text-orange-300 transition-colors duration-200 whitespace-nowrap font-medium text-lg"
                    >
                        {link.label}
                    </a>
                )
            )}
        </>
    );

    useEffect(() => {
        const clientAuth = AuthService.getUserAuth();
        if (clientAuth && clientAuth.id) {
            fetchUserData(clientAuth.id);
        }
    }, []);

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (userMenuOpen && !target.closest('.user-menu-container')) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuOpen]); return (
        <header className="w-full bg-transparent px-8 py-4">
            <div className="flex h-15 items-center justify-between gap-5">
                <div className="flex items-center h-full gap-8">

                    {/* Logo */}

                    <div className="flex h-full items-center flex-shrink-0">
                        <Link className="h-full" to="/">
                            <img
                                src={logo || "/placeholder.svg"}
                                alt="Logo"
                                className="h-full cursor-pointer"
                            />
                        </Link>
                    </div>


                    {/* Desktop Navigation Links */}
                    <div className={`hidden lg:flex items-center gap-5 ${navType === 'affiliatePage' ? 'text-white' : ''}`}>
                        {renderLinks()}
                    </div>
                </div>

                {/* Login Button */}
                <div className="flex-shrink-0 hidden lg:block relative">
                    {userData && navType === 'default' ? (
                        <div className="user-menu-container">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="group flex items-center bg-transparent transition-colors duration-200 font-bold text-lg hover:text-orange-300"
                            >
                                <FaUser className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:fill-orange-300" />
                                Olá, {userData.firstName}
                                <FaChevronDown className={`w-3 h-3 ml-2 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''} group-hover:fill-orange-300`} />
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                    <div className="py-1">
                                        <Link
                                            to="/profile"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                                        >
                                            <FaUser className="w-3 h-3 mr-2 inline" />
                                            Ver Perfil
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                                        >
                                            <FaTimes className="w-3 h-3 mr-2 inline" />
                                            Sair
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to={
                            navType === 'affiliatePage' ? '/affiliate' :
                                navType === 'admin' ? '/admin' :
                                    '/client'
                        }>
                            <button className={`group flex items-center  bg-transparent transition-colors duration-200 font-bold text-lg cursor-pointer hover:text-orange-300 ${navType === 'affiliatePage' ? 'text-white' : ''}`}>
                                <FaUser className={`w-4 h-4 mr-2 group-hover:fill-orange-300 transition-colors duration-200 ${navType === 'affiliatePage' ? 'fill-white' : ''}`} />
                                {navType === 'affiliatePage' ? 'Entrar no sistema' : navType === 'admin' ? 'Login Admin' : 'Login Cliente'}
                            </button>
                        </Link>
                    )}
                </div>

                {/* Mobile Hamburger Button */}
                <div className="lg:hidden ml-auto h-full w-22 bg-white rounded-2xl flex items-center justify-center">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className=" focus:outline-none"
                        aria-label="Abrir menu"
                    >
                        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {
                menuOpen && (
                    <div className="lg:hidden mt-4 bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4 z-50 absolute left-0 right-0 top-20 mx-8">
                        {renderLinks()}
                        {userData && navType === 'default' ? (
                            <div className="border-t pt-4">
                                <div className="flex items-center mb-3 font-bold text-lg">
                                    <FaUser className="w-4 h-4 mr-2" />
                                    Olá, {userData.firstName}
                                </div>
                                <Link
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center py-2 text-gray-700 hover:text-orange-300 transition-colors duration-200"
                                >
                                    <FaUser className="w-3 h-3 mr-2" />
                                    Ver Perfil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center py-2 text-gray-700 hover:text-orange-300 transition-colors duration-200 w-full text-left"
                                >
                                    <FaTimes className="w-3 h-3 mr-2" />
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <Link to={
                                navType === 'affiliatePage' ? '/affiliate' :
                                    navType === 'admin' ? '/admin' :
                                        '/client'
                            }>
                                <button className="group flex items-center bg-transparent transition-colors duration-200 font-bold text-lg cursor-pointer hover:text-orange-300">
                                    <FaUser className="w-4 h-4 mr-2 group-hover:fill-orange-300 transition-colors duration-200" />
                                    {navType === 'affiliatePage' ? 'Login Afiliado' : navType === 'admin' ? 'Login Admin' : 'Login Cliente'}
                                </button>
                            </Link>
                        )}
                    </div>
                )
            }
        </header >
    );
}

export default Navbar;