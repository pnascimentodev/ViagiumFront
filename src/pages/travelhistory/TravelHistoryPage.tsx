import { useState } from "react"
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa"
import Navbar from "../../components/Navbar"

function TravelHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<"Ativas" | "Anteriores" | "Canceladas">("Ativas")
  const [selectedTravel, setSelectedTravel] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const travels = [
    {
      id: "1",
      title: "Escapada Romântica em Paris",
      description: "Uma viagem inesquecível pela cidade do amor, incluindo visitas à Torre Eiffel, Louvre e passeios pelo Sena.",
      destination: "Paris, França",
      duration: "7 dias / 6 noites",
      image: "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg",
      startDate: "15/03/2023",
      endDate: "22/03/2023",
      status: "Concluída",
      price: "R$ 5.500,00",
      createdAt: "10/02/2023",
    },
    {
      id: "2",
      title: "Aventura Tropical em Cancún",
      description: "Pacote completo com resort all-inclusive, mergulho em cenotes e visitas às ruínas maias.",
      destination: "Cancún, México",
      duration: "7 dias / 6 noites",
      image: "https://images.pexels.com/photos/2598663/pexels-photo-2598663.jpeg",
      startDate: "10/07/2024",
      endDate: "17/07/2024",
      status: "Próxima",
      price: "R$ 4.800,00",
      createdAt: "05/06/2024",
    },
    {
      id: "3",
      title: "Descobrindo o Japão Tradicional",
      description: "Experiência única pela cultura japonesa, incluindo Tóquio, Kyoto e a temporada das cerejeiras.",
      destination: "Tóquio, Japão",
      duration: "9 dias / 8 noites",
      image: "https://images.pexels.com/photos/30443953/pexels-photo-30443953.jpeg",
      startDate: "01/09/2022",
      endDate: "10/09/2022",
      status: "Concluída",
      price: "R$ 7.200,00",
      createdAt: "20/07/2022",
    },
    {
      id: "4",
      title: "História e Cultura em Roma",
      description: "Explore a cidade eterna com visitas ao Coliseu, Vaticano e degustação da autêntica culinária italiana.",
      destination: "Roma, Itália",
      duration: "7 dias / 6 noites",
      image: "https://images.pexels.com/photos/2678456/pexels-photo-2678456.jpeg",
      startDate: "05/05/2025",
      endDate: "12/05/2025",
      status: "Próxima",
      price: "R$ 6.100,00",
      createdAt: "15/03/2025",
    },
    {
      id: "5",
      title: "A Grande Maçã te Espera",
      description: "Nova York completa: Broadway, Central Park, Estátua da Liberdade e as melhores atrações da cidade.",
      destination: "Nova York, EUA",
      duration: "7 dias / 6 noites",
      image: "https://images.pexels.com/photos/32479333/pexels-photo-32479333.jpeg",
      startDate: "20/11/2023",
      endDate: "27/11/2023",
      status: "Concluída",
      price: "R$ 5.900,00",
      createdAt: "25/09/2023",
    },
    {
      id: "6",
      title: "Londres Real e Histórica",
      description: "Explore a capital britânica com seus palácio, museus renomados e a tradicional cultura inglesa.",
      destination: "Londres, Reino Unido",
      duration: "6 dias / 5 noites",
      image: "https://images.pexels.com/photos/17649453/pexels-photo-17649453.jpeg",
      startDate: "01/02/2024",
      endDate: "08/02/2024",
      status: "Cancelada",
      price: "R$ 5.300,00",
      createdAt: "10/12/2023",
    },
  ]

  const getButtonClasses = (isActive: boolean) => {
    return isActive
      ? "bg-[#FFA62B] text-[#000000] hover:bg-[#FFA62B]/90" // Laranja/Amarelo para ativo
      : "border border-[#003194] bg-white text-[#003194] hover:bg-blue-50" // Borda azul para inativo
  }

  const openModal = (travel: any) => {
    setSelectedTravel(travel)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedTravel(null)
    setIsModalOpen(false)
  }

  const filteredTravels = travels.filter((travel) => {
    if (activeFilter === "Ativas") {
      return travel.status === "Próxima"
    } else if (activeFilter === "Anteriores") {
      return travel.status === "Concluída"
    } else if (activeFilter === "Canceladas") {
      return travel.status === "Cancelada"
    }
    return true
  })

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Histórico de Viagens</h1>
          <p className="mt-2 text-lg text-gray-600">Veja suas viagens passadas, futuras e canceladas.</p>
        </header>

      <div className="mb-12 flex justify-center gap-4">
        <button
          className={`w-32 px-6 py-2 rounded-full font-medium transition-colors duration-200 ${getButtonClasses(activeFilter === "Ativas")}`}
          onClick={() => setActiveFilter("Ativas")}
        >
          Ativas
        </button>
        <button
          className={`w-32 px-6 py-2 rounded-full font-medium transition-colors duration-200 ${getButtonClasses(activeFilter === "Anteriores")}`}
          onClick={() => setActiveFilter("Anteriores")}
        >
          Anteriores
        </button>
        <button
          className={`w-32 px-6 py-2 rounded-full font-medium transition-colors duration-200 ${getButtonClasses(activeFilter === "Canceladas")}`}
          onClick={() => setActiveFilter("Canceladas")}
        >
          Canceladas
        </button>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl">
          {filteredTravels.map((travel) => (
          <div key={travel.id} className="flex flex-col overflow-hidden rounded-lg shadow-md bg-white w-80">
            <div className="relative h-48 w-full">
              <img
                src={travel.image || "https://via.placeholder.com/300x200"}
                alt={`Imagem de ${travel.destination}`}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <div className="p-4 pb-2">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-1">
                <FaMapMarkerAlt className="h-5 w-5 text-gray-500" />
                {travel.destination}
              </h3>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <FaCalendarAlt className="h-4 w-4 text-gray-500" />
                {travel.startDate} - {travel.endDate}
              </p>
            </div>
            <div className="flex-grow p-4 pt-0">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    travel.status === "Concluída" 
                      ? "bg-[#FFA62B] text-[#000000] hover:bg-[#FFA62B]/90" 
                      : travel.status === "Próxima"
                      ? "bg-[#003194] text-[#FFFFFF] hover:bg-[#003194]/90"
                      : travel.status === "Cancelada"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {travel.status}
                </span>
                <span className="text-lg font-semibold">{travel.price}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 pt-0">
              {travel.status === "Concluída" && (
                <button 
                  onClick={() => openModal(travel)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                >
                  Ver Detalhes
                </button>
              )}
              {travel.status === "Próxima" && (
                <button 
                  onClick={() => openModal(travel)}
                  className="px-4 py-2 text-sm bg-[#003194] text-white rounded-md hover:bg-[#003194]/90 transition-colors duration-200"
                >
                  Ver detalhes
                </button>
              )}
              {travel.status === "Cancelada" && (
                <button 
                  onClick={() => openModal(travel)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                >
                  Ver Detalhes
                </button>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedTravel && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes da Viagem</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <input
                      type="text"
                      value={selectedTravel.title}
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-[#003194] cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destino</label>
                    <input
                      type="text"
                      value={selectedTravel.destination}
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-[#003194] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={selectedTravel.description}
                    disabled
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-[#003194] cursor-not-allowed resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duração</label>
                    <input
                      type="text"
                      value={selectedTravel.duration}
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-[#003194] cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
                    <input
                      type="text"
                      value={selectedTravel.price}
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-[#003194] cursor-not-allowed font-semibold"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-[#003194] text-white rounded-md hover:bg-[#003194]/90 transition-colors duration-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default TravelHistoryPage