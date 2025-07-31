import { useState } from "react"
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa" // Apenas react-icons/fa

function TravelHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<"Ativas" | "Anteriores" | "Canceladas">("Ativas")

  const travels = [
    {
      id: "1",
      destination: "Paris, França",
      image: "https://via.placeholder.com/300x200?text=Paris",
      startDate: "15/03/2023",
      endDate: "22/03/2023",
      status: "Concluída",
      price: "R$ 5.500,00",
    },
    {
      id: "2",
      destination: "Cancún, México",
      image: "https://via.placeholder.com/300x200?text=Cancun",
      startDate: "10/07/2024",
      endDate: "17/07/2024",
      status: "Próxima",
      price: "R$ 4.800,00",
    },
    {
      id: "3",
      destination: "Tóquio, Japão",
      image: "https://via.placeholder.com/300x200?text=Tokyo",
      startDate: "01/09/2022",
      endDate: "10/09/2022",
      status: "Concluída",
      price: "R$ 7.200,00",
    },
    {
      id: "4",
      destination: "Roma, Itália",
      image: "https://via.placeholder.com/300x200?text=Rome",
      startDate: "05/05/2025",
      endDate: "12/05/2025",
      status: "Próxima",
      price: "R$ 6.100,00",
    },
    {
      id: "5",
      destination: "Nova York, EUA",
      image: "https://via.placeholder.com/300x200?text=New+York",
      startDate: "20/11/2023",
      endDate: "27/11/2023",
      status: "Concluída",
      price: "R$ 5.900,00",
    },
    {
      id: "6",
      destination: "Londres, Reino Unido",
      image: "https://via.placeholder.com/300x200?text=London",
      startDate: "01/02/2024",
      endDate: "08/02/2024",
      status: "Cancelada",
      price: "R$ 5.300,00",
    },
  ]

  // Funções para aplicar classes de cor diretamente
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-[#FFA62B] text-[#000000] hover:bg-[#FFA62B]/90" // Laranja/Amarelo
      case "Próxima":
        return "bg-[#003194] text-[#FFFFFF] hover:bg-[#003194]/90" // Azul Escuro
      case "Cancelada":
        return "bg-red-500 text-white hover:bg-red-600" // Cor para cancelada (substituindo destructive)
      default:
        return "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100" // Outline padrão
    }
  }

  const getButtonClasses = (isActive: boolean) => {
    return isActive
      ? "bg-[#FFA62B] text-[#000000] hover:bg-[#FFA62B]/90" // Laranja/Amarelo para ativo
      : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100" // Outline para inativo
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
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Histórico de Viagens</h1>
        <p className="mt-2 text-lg text-gray-600">Veja suas viagens passadas, futuras e canceladas.</p>
      </header>

      <div className="mb-8 flex justify-center gap-4">
        <button
          className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${getButtonClasses(activeFilter === "Ativas")}`}
          onClick={() => setActiveFilter("Ativas")}
        >
          Ativas
        </button>
        <button
          className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${getButtonClasses(activeFilter === "Anteriores")}`}
          onClick={() => setActiveFilter("Anteriores")}
        >
          Anteriores
        </button>
        <button
          className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${getButtonClasses(activeFilter === "Canceladas")}`}
          onClick={() => setActiveFilter("Canceladas")}
        >
          Canceladas
        </button>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTravels.map((travel) => (
          <div key={travel.id} className="flex flex-col overflow-hidden rounded-lg shadow-md bg-white">
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
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(travel.status)}`}
                >
                  {travel.status}
                </span>
                <span className="text-lg font-semibold">{travel.price}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 pt-0">
              {travel.status === "Concluída" && (
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-200">
                  Ver Detalhes
                </button>
              )}
              {travel.status === "Próxima" && (
                <button className="px-4 py-2 text-sm bg-[#003194] text-white rounded-md hover:bg-[#003194]/90 transition-colors duration-200">
                  Gerenciar Reserva
                </button>
              )}
              {travel.status === "Cancelada" && (
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-200">
                  Ver Detalhes
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default TravelHistoryPage