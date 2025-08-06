
import { useState } from "react";
import logo from "../assets/img/logo.svg";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";


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

    // Listas de links
    const navLinksDefault: NavLink[] = [
        { label: 'Pacotes', href: '/#pacotes' },
        { label: 'Vantagens', href: '/#vantagens' },
        { label: 'Parceiros', href: '/#parceiros' },
        { label: 'Área do afiliado', href: '/affiliatepage' },
        { label: 'Acesso Admin', href: '/admin' },
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

    return (
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
                <div className="flex-shrink-0 hidden lg:block">
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
                        <Link to={
                            navType === 'affiliatePage' ? '/affiliate' :
                                navType === 'admin' ? '/admin' :
                                    '/login'
                        }>
                            <button className="group flex items-center bg-transparent transition-colors duration-200 font-bold text-lg cursor-pointer hover:text-orange-300">
                                <FaUser className="w-4 h-4 mr-2 group-hover:fill-orange-300 transition-colors duration-200" />
                                {navType === 'affiliatePage' ? 'Login Afiliado' : navType === 'admin' ? 'Login Admin' : 'Login Cliente'}
                            </button>
                        </Link>
                    </div>
                )
            }
        </header >
    );
}

export default Navbar;