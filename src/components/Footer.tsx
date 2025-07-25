import linkedin from "../assets/img/linkedin.svg"
import instagram from "../assets/img/instagram.svg"
import logo from "../assets/img/logo.svg";
import boleto from "../assets/img/boleto.svg"
import cartao from "../assets/img/cartao.svg"
import pix from "../assets/img/pix.svg"


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
                            <li>
                                <a href="/faq" className="text-[#FFFFFF] hover:text-[#FFA62B] transition-colors duration-200">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Informações*/}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#FFA62B]">Informações</h3>
                        <div className="mb-2 !text-[#FFFFFF]">
                            <ul className="space-y-2">
                                <li className="!text-white">
                                    Contato: (81) 3343-3535
                                </li>
                                <li className="!text-white">
                                    CNPJ:
                                </li>
                                <li className="!text-white">
                                    84.963.593/0001-81
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Formas de pagamento*/}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#FFA62B]">Formas de pagamento</h3>
                        <div className="flex space-x-2 gap-3">
                                <img src={boleto} alt="Boleto" className="w-6 h-6" />
                                <img src={cartao} alt="Cartão" className="w-6 h-6" />
                                <img src={pix} alt="Pix" className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#FFA62B]">Siga nossas redes</h3>
                        <div className="flex space-x-4 gap-3">
                                <img src={instagram} alt="Instagram" className="w-6 h-6" />
                                <img src={linkedin} alt="Linkedin" className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="mt-12 border-t border-blue-400 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-semibold mb-2 text-[#FFFFFF]">Ainda não é cliente?</h3>
                            <p className="text-sm text-[#FFFFFF]">Cadastre-se para receber promoções exclusivas</p>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <button className="bg-[#FFFFFF] hover:scale-105 hover:text-[#FFA62B] px-4 py-2 rounded font-medium transition-colors duration-200">
                                Cadastre-se
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="flex justify-center gap-4 items-center mt-12 text-center text-sm ">
                     <img src={logo} alt="Logo Viagium" className="w-6 h-6" />
                    <p className="text-white">© 2025 Viagium, Inc. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
export default Footer;