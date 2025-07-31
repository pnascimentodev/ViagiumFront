import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import Navbar from "../../components/Navbar"

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

    const toggleItem = (index: number) => {
        setOpenItem(openItem === index ? null : index)
    }

    return (
        <>
            <Navbar />
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
