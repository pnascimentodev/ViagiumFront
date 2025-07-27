import { useState } from "react";
import logo from "../assets/img/logo.svg";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";


function AffiliatePageNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = (
        <>
            <a
                href="#vantagens"
                className="hover:text-orange-300 transition-colors duration-200 whitespace-nowrap font-medium text-lg"
            >
                Vantagens
            </a>
            <a
                href="#nossos-parceiros"
                className="hover:text-orange-300 transition-colors duration-200 whitespace-nowrap font-medium text-lg"
            >
                Nossos Parceiros
            </a>
            <a
                href="#cadastro-se"
                className="hover:text-orange-300 transition-colors duration-200 whitespace-nowrap font-medium text-lg"
            >
                Cadastre-se
            </a>
            <a
                href="#"
                className="hover:text-orange-300 transition-colors duration-200 whitespace-nowrap font-medium text-lg"
            >
                Sobre Nós
            </a>
        </>
    );

    return (
        <header className="w-full bg-transparent px-8 py-4">
            <div className="flex h-15 items-center justify-between gap-5">
                <div className="flex items-center h-full gap-8">
                    {/* Logo */}
                    <div className="flex h-full items-center flex-shrink-0">
                        <img
                            src={logo || "/placeholder.svg"}
                            alt="Logo"
                            className="h-full"
                        />
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-5 text-white">
                        {navLinks}
                    </div>
                </div>

                {/* Login Button */}
                <div className="flex-shrink-0 hidden md:block">
                    <Link to="/affiliate">
                        <button className="group flex items-center text-white bg-transparent transition-colors duration-200 font-bold text-lg cursor-pointer hover:text-orange-300">
                            <FaUser className="w-4 h-4 mr-2 fill-white group-hover:fill-orange-300 transition-colors duration-200" />
                            Login
                        </button>
                    </Link>
                </div>

                {/* Mobile Hamburger Button */}
                <div className="md:hidden ml-auto h-full w-22 bg-white rounded-2xl flex items-center justify-center">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white focus:outline-none"
                        aria-label="Abrir menu"
                    >
                        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4 z-50 absolute left-0 right-0 top-20 mx-8">
                    {navLinks}
                    <Link to="/affiliate">
                        <button className="group flex items-center bg-transparent transition-colors duration-200 font-bold text-lg cursor-pointer hover:text-orange-300">
                            <FaUser className="w-4 h-4 mr-2 group-hover:fill-orange-300 transition-colors duration-200" />
                            Login
                        </button>
                    </Link>
                </div>
            )}
        </header>
    );
}

export default AffiliatePageNavbar;