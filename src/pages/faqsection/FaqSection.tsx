import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"


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
                "Aceitamos cartão de crédito, PIX e boleto bancário para facilitar sua viagem dos sonhos.",
        },
        {
            question: "Posso cancelar ou alterar minha reserva?",
            answer:
                "Sim! Você pode cancelar ou alterar sua reserva de acordo com nossas políticas de cancelamento. Entre em contato conosco o quanto antes para verificar as condições e possíveis taxas aplicáveis.",
        },
        {
            question: "Como entro em contato com o suporte da Viagium?",
            answer:
                "Você pode entrar em contato através do nosso e-mail (contato@viagium.app). Nossa equipe está pronta para ajudar!",
        },
        {
            question: "Quais documentos preciso para viajar?",
            answer:
                "Para viagens nacionais, é necessário RG ou CNH com foto. Para viagens internacionais, é obrigatório o passaporte válido e, dependendo do destino, visto de entrada. Verificamos todos os requisitos específicos de cada destino para você.",
        },
        {
            question: "O seguro viagem está incluído nos pacotes?",
            answer:
                "O seguro viagem pode estar incluído em alguns pacotes específicos. Para outros, oferecemos a opção de contratar separadamente com cobertura completa para emergências médicas, cancelamento de viagem e bagagem extraviada.",
        },
        {
            question: "Qual é a política de bagagem?",
            answer:
                "A política de bagagem varia conforme a companhia aérea e tipo de passagem. Informamos todos os detalhes sobre peso, dimensões e franquia de bagagem no momento da reserva. Bagagem extra pode ser contratada com desconto através da Viagium.",
        },
        {
            question: "Crianças pagam o valor integral?",
            answer:
                "Crianças de 0 a 2 anos (colo) pagam apenas taxas aeroportuárias. De 2 a 11 anos, há desconto especial que varia conforme o destino e hotel. Consulte nossa equipe para condições específicas do seu pacote.",
        },
        {
            question: "Como posso acompanhar promoções e ofertas especiais?",
            answer:
                "Cadastre-se em nossa newsletter, siga nossas redes sociais (@viagium) e ative as notificações do nosso site. Enviamos regularmente ofertas exclusivas, last minute e promoções sazonais para nossos clientes.",
        },
        {
            question: "Posso escolher meu hotel e voo separadamente?",
            answer:
                "Não! A viagium se preocupa tanto que cuida de todos os detalhes para você, só é necessário escolher o pacote, hotel e quarto! O resto deixa que cuídamos para você.",
        },
        {
            question: "Quais destinos vocês atendem?",
            answer:
                "Atendemos destinos nacionais (todas as regiões do Brasil) e internacionais (América do Sul, América do Norte, Europa, Ásia, África e Oceania). Temos parcerias especiais com mais de 150 destinos ao redor do mundo.",
        },
        {
            question: "Vocês organizam atividades e passeios nos destinos?",
            answer:
                "Sim! Oferecemos uma ampla gama de experiências: city tours, passeios gastronômicos, aventuras radicais, visitas culturais e muito mais. Todos os passeios são com guias locais qualificados e seguros.",
        },
        {
            question: "E se eu tiver problemas durante a viagem?",
            answer:
                "Temos suporte 24h durante sua viagem através do nosso WhatsApp de emergência. Nossa equipe está preparada para resolver qualquer imprevisto, desde problemas com voos até questões de hospedagem.",
        },
        {
            question: "Vocês oferecem pacotes de lua de mel?",
            answer:
                "Sim! Temos pacotes românticos especiais com upgrades de quarto, jantares privativos, spa para casais e experiências únicas. Nossos consultores especializados ajudam a criar a lua de mel perfeita.",
        },
        {
            question: "Qual a antecedência mínima para reservar?",
            answer:
                "Para viagens nacionais, recomendamos pelo menos 15 dias de antecedência. Para internacionais, 30 dias. Porém, temos opções de last minute disponíveis com condições especiais para viagens de última hora.",
        },
        {
            question: "Vocês trabalham com milhas aéreas?",
            answer:
                "Não! Aproveite nossas promoções para garantir condições especiais para realizar seu sonho.",
        }
    ]

    const [openItem, setOpenItem] = useState<number | null>(null)

    const toggleItem = (index: number) => {
        setOpenItem(openItem === index ? null : index)
    }

    return (
        <>
            <Navbar />
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="w-full px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#003194] -mt-8 md:-mt-12 lg:-mt-16">
                            Perguntas Frequentes
                        </h2>
                        <p className="mt-12 mb-8 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed whitespace-nowrap">
                            Encontre respostas para as perguntas mais comuns sobre os serviços da Viagium.
                        </p>
                    </div>
                <div className="mx-auto mt-12 max-w-3xl">
                    <div className="max-h-[800px] overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 last:border-b-0 px-4">
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
            </div>
        </section>
        <Footer/>
        </>
    )
}

export default FAQSection;