import { useState } from "react"
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa"
import Navbar from "../../components/Navbar"
import { useReservations, type Reservation } from "../../hooks/useReservations"

function TravelHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<"Ativas" | "Anteriores" | "Canceladas">("Ativas")
  const [selectedTravel, setSelectedTravel] = useState<Reservation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // TODO: Pegar o ID do usuário do contexto/estado global
  const userId = "1" // Por enquanto hardcoded, depois você pode pegar do contexto do usuário logado
  const { reservations, loading, error, refetch } = useReservations(userId)

  const getButtonClasses = (isActive: boolean) => {
    return isActive
      ? "bg-[#FFA62B] text-[#000000] hover:bg-[#FFA62B]/90" // Laranja/Amarelo para ativo
      : "border border-[#003194] bg-white text-[#003194] hover:bg-blue-50" // Borda azul para inativo
  }

  const openModal = (travel: Reservation) => {
    setSelectedTravel(travel)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedTravel(null)
    setIsModalOpen(false)
  }

  const filteredTravels = reservations.filter((reservation) => {
    if (activeFilter === "Ativas") {
      return reservation.status === "confirmed"
    } else if (activeFilter === "Anteriores") {
      return reservation.status === "finished"
    } else if (activeFilter === "Canceladas") {
      return reservation.status === "cancelled"
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

        {/* Estados de Loading e Erro */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003194]"></div>
            <span className="ml-3 text-lg text-gray-600">Carregando reservas...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao carregar reservas
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={refetch}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
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

            {filteredTravels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  {activeFilter === "Ativas" && "Você não possui viagens ativas no momento."}
                  {activeFilter === "Anteriores" && "Você ainda não possui viagens concluídas."}
                  {activeFilter === "Canceladas" && "Você não possui viagens canceladas."}
                </p>
              </div>
            ) : (
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
                    travel.status === "finished" 
                      ? "bg-[#FFA62B] text-[#000000] hover:bg-[#FFA62B]/90" 
                      : travel.status === "confirmed"
                      ? "bg-[#003194] text-[#FFFFFF] hover:bg-[#003194]/90"
                      : travel.status === "cancelled"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {travel.status === "confirmed" ? "Ativa" : 
                   travel.status === "finished" ? "Concluída" : 
                   travel.status === "cancelled" ? "Cancelada" : travel.status}
                </span>
                <span className="text-lg font-semibold">{travel.price}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 pt-0">
              {travel.status === "finished" && (
                <button 
                  onClick={() => openModal(travel)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                >
                  Ver Detalhes
                </button>
              )}
              {travel.status === "confirmed" && (
                <button 
                  onClick={() => openModal(travel)}
                  className="px-4 py-2 text-sm bg-[#003194] text-white rounded-md hover:bg-[#003194]/90 transition-colors duration-200"
                >
                  Ver detalhes
                </button>
              )}
              {travel.status === "cancelled" && (
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
            )}
          </>
        )}

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