import linkedin from "../assets/img/linkedin.svg"
import instagram from "../assets/img/instagram.svg"
import logo from "../assets/img/logo.svg";
import facebook from "../assets/img/facebook.svg"
import boleto from "../assets/img/boleto.svg"
import cartao from "../assets/img/cartao.svg"
import pix from "../assets/img/pix.svg"
import { Button } from "./Button"


function Footer(){
    return(
        <footer className="bg-[#003194E6] text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl text-[#FFFFFF] md:text-3xl font-bold mb-4">Descubra o mundo com quem entende de viagem</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Links Column 1 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#FFA62B]">Navegação</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-[#FFFFFF] hover:text-[#FFA62B] transition-colors duration-200">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/pacotes" className="text-[#FFFFFF] hover:text-[#FFA62B] transition-colors duration-200">
                                    Pacotes
                                </a>
                            </li>
                            <li>
                                <a href="/sobre" className="text-[#FFFFFF] hover:text-[#FFA62B] transition-colors duration-200">
                                    Sobre nós
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#FFA62B]">Informações</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/contato" className="hover:text-[#FFA62B] transition-colors duration-200">
                                    Contato
                                </a>
                            </li>
                            <li>
                                <a href="/pagamento" className="hover:text-[#FFA62B] transition-colors duration-200">
                                    Formas de pagamento
                                </a>
                            </li>
                            <li>
                                <a href="/afiliados" className="hover:text-[#FFA62B] transition-colors duration-200">
                                    Afiliados
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#FFA62B]">Contato</h3>
                        <p className="mb-2">Telefone: (81) 3343-3535</p>
                        <p>CNPJ: 84.963.593/0001-81</p>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#FFA62B]">Siga nossas redes</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-[#FFA62B] transition-colors duration-200">
                                <img src={facebook} alt="Facebook" className="w-6 h-6" />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="#" className="hover:text-[#FFA62B] transition-colors duration-200">
                                <img src={instagram} alt="Instagram" className="w-6 h-6" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="hover:text-[#FFA62B] transition-colors duration-200">
                                <img src={linkedin} alt="Linkedin" className="w-6 h-6" />
                                <span className="sr-only">Linkedin</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="mt-12 border-t border-blue-400 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-semibold mb-2">Receba nossas ofertas</h3>
                            <p className="text-sm text-gray-300">Cadastre seu email para receber promoções exclusivas</p>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Seu email"
                                className="px-4 py-2 w-full md:w-64 text-gray-900 rounded-l focus:outline-none"
                            />
                            <button className="bg-[#FFA62B] hover:bg-[#e89826] px-4 py-2 rounded-r font-medium transition-colors duration-200">
                                Assinar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 text-center text-sm text-gray-300">
                    <p>© 2025 Viagium, Inc. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
export default Footer;