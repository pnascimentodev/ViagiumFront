import { useState } from "react"
import { FaChevronDown, FaUser, FaBars, FaTimes } from "react-icons/fa"
import logo from "../../assets/img/logo.svg"

function FAQSection() {
    const faqs = [
        {
            question: "O que é a Viagium e como funciona?",
            answer:
                "A Viagium é uma agência de viagens online que oferece pacotes turísticos personalizados para destinos nacionais e internacionais. Trabalhamos com os melhores parceiros para garantir experiências únicas e preços competitivos.",
        },
        {
            question: "Como posso reservar um pacote de viagem?",
            answer:
                "Você pode navegar pelos nossos pacotes disponíveis, escolher o que mais combina com você e fazer a reserva diretamente pelo site.",
        },
        {
            question: "Quais formas de pagamento a Viagium aceita?",
            answer:
                "Aceitamos cartão de crédito (Visa, MasterCard, Elo), PIX, boleto bancário e oferecemos opções de parcelamento em até 12x sem juros para facilitar sua viagem dos sonhos.",
        },
        {
            question: "Posso cancelar ou alterar minha reserva?",
            answer:
                "Sim! Você pode cancelar ou alterar sua reserva de acordo com nossas políticas de cancelamento. Entre em contato conosco o quanto antes para verificar as condições e possíveis taxas aplicáveis.",
        },
        {
            question: "Como entro em contato com o suporte da Viagium?",
            answer:
                "Você pode entrar em contato através do nosso WhatsApp, e-mail (contato@viagium.com) ou pelo formulário de contato em nosso site. Nossa equipe está pronta para ajudar!",
        },
    ]

    const [openItem, setOpenItem] = useState<number | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleItem = (index: number) => {
        setOpenItem(openItem === index ? null : index)
    }

    return (
        <>
            <style>{`
                .faq-navbar a,
                .faq-navbar button {
                    color: #003194 !important;
                }
                .faq-navbar a:hover,
                .faq-navbar button:hover {
                    color: #FFA62B !important;
                }
                .faq-navbar .fill-white {
                    fill: #003194 !important;
                }
                .faq-navbar .group-hover\\:fill-orange-300 {
                    fill: #003194 !important;
                }
                .faq-navbar .group:hover .group-hover\\:fill-orange-300 {
                    fill: #FFA62B !important;
                }
            `}</style>
            
            {/* Navbar Customizada */}
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
                        <div className="hidden md:flex items-center gap-5 text-[#003194]">
                            <a
                                href="#pacotes"
                                className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg"
                            >
                                Pacotes
                            </a>
                            <a
                                href="#vantagens"
                                className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg"
                            >
                                Vantagens
                            </a>
                            <a
                                href="#parceiros"
                                className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg"
                            >
                                Parceiros
                            </a>
                            <a
                                href="#area-afiliado"
                                className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg"
                            >
                                Área do Afiliado
                            </a>
                            <a
                                href="#acesso-admin"
                                className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg"
                            >
                                Acesso Admin
                            </a>
                            <a
                                href="#sobre-nos"
                                className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg"
                            >
                                Sobre Nós
                            </a>
                        </div>
                    </div>

                    {/* Login Button */}
                    <div className="flex-shrink-0 hidden md:block">
                        <button className="group flex items-center text-[#003194] bg-transparent transition-colors duration-200 font-bold text-lg cursor-pointer hover:text-[#FFA62B]">
                            <FaUser className="w-4 h-4 mr-2 fill-[#003194] group-hover:fill-[#FFA62B] transition-colors duration-200" />
                            Login Cliente
                        </button>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden ml-auto h-full w-22 bg-white rounded-2xl flex items-center justify-center">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-[#003194] focus:outline-none"
                            aria-label="Abrir menu"
                        >
                            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4 z-50 absolute left-0 right-0 top-20 mx-8">
                        <a
                            href="#pacotes"
                            className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg text-[#003194]"
                        >
                            Pacotes
                        </a>
                        <a
                            href="#vantagens"
                            className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg text-[#003194]"
                        >
                            Vantagens
                        </a>
                        <a
                            href="#parceiros"
                            className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg text-[#003194]"
                        >
                            Parceiros
                        </a>
                        <a
                            href="#area-afiliado"
                            className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg text-[#003194]"
                        >
                            Área do Afiliado
                        </a>
                        <a
                            href="#acesso-admin"
                            className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg text-[#003194]"
                        >
                            Acesso Admin
                        </a>
                        <a
                            href="#sobre-nos"
                            className="hover:text-[#FFA62B] transition-colors duration-200 whitespace-nowrap font-medium text-lg text-[#003194]"
                        >
                            Sobre Nós
                        </a>
                        <button className="group flex items-center bg-transparent transition-colors duration-200 font-bold text-lg cursor-pointer hover:text-[#FFA62B] text-[#003194]">
                            <FaUser className="w-4 h-4 mr-2 group-hover:fill-[#FFA62B] transition-colors duration-200 fill-[#003194]" />
                            Login Cliente
                        </button>
                    </div>
                )}
            </header>
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#003194]">
                            Perguntas Frequentes
                        </h2>
                        <p className="mt-4 mb-8 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed whitespace-nowrap">
                            Encontre respostas para as perguntas mais comuns sobre os serviços da Viagium.
                        </p>
                    </div>
                <div className="mx-auto mt-8 max-w-3xl">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 last:border-b-0">
                            <button
                                className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-[#003194] hover:text-[#FFA62B] focus:outline-none"
                                onClick={() => toggleItem(index)}
                                aria-expanded={openItem === index}
                                aria-controls={`faq-content-${index}`}
                            >
                                {faq.question}
                                <FaChevronDown
                                    className={`h-5 w-5 transition-transform duration-300 ${openItem === index ? "rotate-180" : ""}`}
                                />
                            </button>
                            <div
                                id={`faq-content-${index}`}
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openItem === index ? "max-h-screen py-2" : "max-h-0"
                                    }`}
                            >
                                <p className="pb-4 text-base text-gray-700">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        </>
    )
}

export default FAQSection;
