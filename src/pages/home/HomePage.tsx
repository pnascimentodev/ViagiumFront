import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer";
import HotelCarousel from "../../components/HotelCarousel";
import { Link } from "react-router-dom";
import TravelPackageCard from "../../components/TravelPackageCard";
import Badge from "../../components/Badge";
import axios from "axios";
import type { TravelPackage } from "../../types/travelPackageTypes";

// ...existing code...

export default function HomePage() {
    const [packages, setPackages] = useState<any[]>([]);

    // Pode ser usado diretamente no HomePage.tsx, na hora de setar os pacotes
    function mapApiToTravelPackage(apiPkg: any): TravelPackage {
        return {
            id: apiPkg.travelPackageId,
            title: apiPkg.title,
            description: apiPkg.description,
            vehicleType: apiPkg.vehicleType,
            price: apiPkg.price,
            originalPrice: apiPkg.originalPrice,
            packageTax: apiPkg.packageTax,
            duration: apiPkg.duration,
            image: apiPkg.imageUrl,
            rating: 5, // valor fixo, ajuste se necessário
            reviews: 10, // valor fixo, ajuste se necessário
            maxPeople: apiPkg.maxPeople,
            originAddress: apiPkg.originAddress ?? { city: "Origem", country: "BR" },
            destinationAddress: apiPkg.destinationAddress ?? { city: "Destino", country: "BR" },
            isActive: apiPkg.isActive,
            schedules: [], // ajuste se necessário
        };
    }

    useEffect(() => {
        document.title = "Viagium | Descubra o Mundo Com Quem Entende de Viagem";
        axios.get("http://localhost:5028/api/TravelPackage")
            .then(res => setPackages(res.data.map(mapApiToTravelPackage)))
            .catch(() => setPackages([]));
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div className="fixed top-0 left-0 w-full z-50 bg-white">
                <Navbar />
            </div>

            {/* Hero Section */}
            <section className="relative text-white pt-23">
                <div
                    className="relative bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center"
                    style={{
                        backgroundImage: `url('https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg?_gl=1*1md62kf*_ga*MjExNjU5NzU2My4xNzUyNTM4NzQ0*_ga_8JE65Q40S6*czE3NTM1ODYwNTMkbzEwJGcxJHQxNzUzNTg3MDU3JGo1MSRsMCRoMA..')`,
                    }}
                >
                    <div className="absolute inset-0 bg-[#0000007a]"></div>
                    <div className="relative container mx-auto px-4 py-24 md:py-32">
                        <div className="max-w-4xl mx-auto text-center" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Descubra o mundo com quem entende de viagem!</h1>
                            <p className="text-xl md:text-2xl mb-8 text-white/90">
                                A Viagium conecta viajantes com destinos e hotéis incríveis
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/packagesearch">
                                    <button className="bg-[#003194] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#002377] transition-colors text-lg font-bold cursor-pointer transform hover:scale-105 ">
                                        <span className="inline-block mr-2">📍</span>
                                        Explore Destinos
                                    </button>
                                </Link>
                                <Link to="/affiliatePage">
                                    <button className="bg-[#003194] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#002377] transition-colors text-lg font-bold cursor-pointer transform hover:scale-105 ">
                                        <span className="inline-block">📈</span>
                                        Seja nosso filiado
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Travel Packages Section */}
            <section id="pacotes" className="py-16 bg-white">
                <div className="container mx-auto px-4 py-10">
                    <div className="text-center mb-12">
                        <Badge variant="blue" className="mb-10">
                            Os melhores pacotes
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Descubra lugares incríveis</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experiências de viagem selecionadas para criar memórias que duram uma vida inteira
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {packages.slice(0, 4).map((pkg) => (
                            <TravelPackageCard
                                key={pkg.id}
                                pkg={{
                                    id: pkg.id,
                                    title: pkg.title,
                                    description: pkg.description,
                                    vehicleType: pkg.vehicleType,
                                    price: pkg.price,
                                    originalPrice: pkg.originalPrice,
                                    packageTax: pkg.packageTax,
                                    duration: pkg.duration,
                                    image: pkg.imageUrl,
                                    rating: 5, // valor fixo ou ajuste conforme necessário
                                    reviews: 10, // valor fixo ou ajuste conforme necessário
                                    maxPeople: pkg.maxPeople,
                                    originAddress: { city: pkg.originCity, country: pkg.originCountry }, // ajuste conforme necessário
                                    destinationAddress: { city: pkg.destinationCity, country: pkg.destinationCountry }, // ajuste conforme necessário
                                    isActive: pkg.isActive,
                                    schedules: [], // ajuste se houver dados
                                }}
                            />
                        ))}
                    </div>

                    {/* Find Your Perfect Package Button */}
                    <div className="text-center">
                        <Link to="/packagesearch">
                            <button
                                className="bg-gradient-to-r from-[#FFA62B] to-[#1A3799] text-white px-12 py-4 text-2xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer rounded-xl mb-2"
                            >
                                <span className="inline-block mr-2">📍</span>
                                Ache seu pacote perfeito
                            </button>
                        </Link>
                        <p className="text-gray-600 text-lg mt-3">Explore todos os nossos destinos </p>
                    </div>
                </div>
            </section>

            {/* Travelers Benefits Section */}
            <section id="vantagens" className="py-16 bg-[#003194]">
                <div className="container mx-auto py-10 px-4 flex flex-col gap-4">
                    <div className="text-center mb-12">
                        <Badge variant="blue" className="mb-4">
                            Para Viajantes
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">Por que escolher a Viagium?</h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Descubra o mundo através de nossas experiências de viagem selecionadas e ofertas imbatíveis
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                            <div className="p-8 text-center">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="inline-block text-2xl">💰</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Melhor Preço Garantido</h3>
                                <p className="text-gray-600">
                                    Oferecemos tarifas competitivas e ofertas exclusivas que você não encontrará em nenhum outro lugar
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                            <div className="p-8 text-center">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="inline-block text-2xl">📅</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Processo de Reserva Fácil</h3>
                                <p className="text-gray-600">
                                    Reserve suas férias dos sonhos em apenas alguns cliques com nossa plataforma
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                            <div className="p-8 text-center">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="inline-block text-2xl">🛡️</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Plataforma Segura e Confiável</h3>
                                <p className="text-gray-600">
                                    Suas reservas e informações pessoais estão protegidas com segurança de ponta
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hotels Benefits Section */}
            <section id="parceiros" className="py-16 bg-white">
                <div className="container mx-auto px-4 py-10">
                    <div className="text-center mb-12">
                        <Badge variant="teal" className="mb-4">
                            Para Hotéis Parceiros
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Faça seu Hotel Crescer</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Junte-se à nossa rede de hotéis premium e alcance milhões de viajantes em todo o mundo
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 container mx-auto max-w-5xl px-4">
                        <div className="relative h-full">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1682089297123-85459da8036b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Hotel lobby"
                                className="rounded-lg shadow-lg h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col space-y-4 gap-5">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Porque se filiar à Viagium?</h3>
                            <div className="flex flex-col space-y-4 gap-5">
                                <div className="flex items-start space-x-3 gap-4">
                                    <div className="bg-teal-100 p-2 rounded-full">
                                        <span className="inline-block">📈</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Maior Visibilidade</h4>
                                        <p className="text-gray-600">Alcance milhões de hóspedes em potencial através da nossa plataforma</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 gap-4">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <span className="inline-block">👥</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Reservas Diretas</h4>
                                        <p className="text-gray-600">Receba reservas diretamente sem comissões de terceiros</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 gap-4">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <span className="inline-block">📅</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Gestão Simplificada</h4>
                                        <p className="text-gray-600">Painel simples para gerenciar reservas e disponibilidade</p>
                                    </div>
                                </div>
                            </div>
                            <Link to="/affiliatePage">
                                <button
                                    className="bg-[#1A3799] text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer rounded-xl w-full"
                                >
                                    <span className="text-white" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>Registre seu Hotel</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gray-50 flex flex-col gap-20">
                <div className="container mx-auto px-4 py-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">As Melhores Avaliações</h2>
                        <p className="text-xl text-gray-600">Confiado por milhares de viajantes e parceiros hoteleiros em todo o mundo</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="inline-block text-yellow-400">⭐</span>
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4">
                                    "A Viagium tornou o planejamento da nossa lua de mel muito fácil. Os pacotes eram incríveis e o atendimento ao cliente foi excepcional!"
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-semibold">SJ</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Ana Souza</p>
                                        <p className="text-sm text-gray-500">Cliente</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="inline-block text-yellow-400">⭐</span>
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4">
                                    "Desde que fizemos parceria com a Viagium, nossas reservas de hotel aumentaram em 40%. A plataforma é
                                    fácil de usar e eficaz."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-teal-600 font-semibold">MC</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Miguel Chen</p>
                                        <p className="text-sm text-gray-500">Gerente de Hotel</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="inline-block text-yellow-400">⭐</span>
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4">
                                    "A melhor experiência de reserva de viagens que já tive. Ótimos preços, fácil reserva e excelente atendimento ao cliente."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-green-600 font-semibold">ER</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Emília Rodriguez</p>
                                        <p className="text-sm text-gray-500">Viajante Frequente</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Partner Logos */}
                <div className="text-center container mx-auto px-4 mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">As Melhores Redes de Hotéis Estão Aqui</h2>
                    <div className="mx-auto">
                        <HotelCarousel />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    )
}
