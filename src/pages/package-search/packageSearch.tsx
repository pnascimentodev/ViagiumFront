import { useState, useMemo } from "react"
import TravelPackageCard from "../../components/TravelPackageCard"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { FaCalendarAlt, FaChevronDown, FaSearch } from "react-icons/fa"
import { ImCross } from "react-icons/im"

const travelPackages = [
  {
    id: 1,
    title: "Paraíso Tropical",
    description: "Viva praias paradisíacas, águas cristalinas e resorts de luxo nesta escapada inesquecível.",
    price: 1299,
    originalPrice: 1499,
    duration: 7,
    image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
    rating: 4.8,
    reviews: 324,
    qtySalesLimit: 20,
    qtySold: 8,
    originAddress: { country: "Brasil", city: "São Paulo" },
    destinationAddress: { country: "Maldivas", city: "Malé" },
  },
  {
    id: 2,
    title: "Descoberta Cultural Europeia",
    description: "Explore cidades históricas, museus renomados e culinária autêntica em três capitais europeias.",
    price: 2199,
    originalPrice: 2399,
    duration: 14,
    image: "https://images.pexels.com/photos/2574631/pexels-photo-2574631.jpeg",
    rating: 4.6,
    reviews: 189,
    qtySalesLimit: 30,
    qtySold: 15,
    originAddress: { country: "Brasil", city: "Rio de Janeiro" },
    destinationAddress: { country: "França", city: "Paris" },
  },
  {
    id: 3,
    title: "Trilha de Aventura nas Montanhas",
    description: "Desafie-se em trilhas de tirar o fôlego, vistas incríveis e experiências de acampamento ao ar livre.",
    price: 899,
    originalPrice: 999,
    duration: 5,
    image: "https://images.pexels.com/photos/1036660/pexels-photo-1036660.jpeg",
    rating: 4.9,
    reviews: 156,
    qtySalesLimit: 10,
    qtySold: 7,
    originAddress: { country: "Brasil", city: "Belo Horizonte" },
    destinationAddress: { country: "Estados Unidos", city: "Rocky Mountains" },
  },
  {
    id: 4,
    title: "Experiência de Safári",
    description: "Veja os Big Five em seu habitat natural com guias especialistas e lodges de luxo.",
    price: 3299,
    originalPrice: 3499,
    duration: 10,
    image: "https://images.pexels.com/photos/11760865/pexels-photo-11760865.jpeg",
    rating: 4.7,
    reviews: 278,
    qtySalesLimit: 15,
    qtySold: 10,
    originAddress: { country: "Brasil", city: "Brasília" },
    destinationAddress: { country: "Quênia", city: "Nairobi" },
  },
  {
    id: 5,
    title: "Jornada Gastronômica Asiática",
    description: "Descubra sabores autênticos, aulas de culinária e tours de comida de rua em cidades vibrantes da Ásia.",
    price: 1799,
    originalPrice: 1999,
    duration: 12,
    image: "https://images.pexels.com/photos/1510595/pexels-photo-1510595.jpeg",
    rating: 4.5,
    reviews: 203,
    qtySalesLimit: 25,
    qtySold: 12,
    originAddress: { country: "Brasil", city: "Curitiba" },
    destinationAddress: { country: "Japão", city: "Tóquio" },
  },
  {
    id: 6,
    title: "Aventura Aurora Boreal",
    description: "Persiga a aurora boreal com passeios de trenó, hotéis de gelo e natureza ártica.",
    price: 2799,
    originalPrice: 2999,
    duration: 8,
    image: "https://images.pexels.com/photos/2602543/pexels-photo-2602543.jpeg",
    rating: 4.8,
    reviews: 142,
    qtySalesLimit: 18,
    qtySold: 9,
    originAddress: { country: "Brasil", city: "Manaus" },
    destinationAddress: { country: "Islândia", city: "Keflavík" },
  },
  {
    id: 7,
    title: "Cruzeiro Mediterrâneo",
    description: "Navegue por águas azuis visitando cidades costeiras charmosas e portos históricos.",
    price: 1599,
    originalPrice: 1799,
    duration: 9,
    image: "https://images.pexels.com/photos/772689/pexels-photo-772689.jpeg",
    rating: 4.4,
    reviews: 367,
    qtySalesLimit: 40,
    qtySold: 20,
    originAddress: { country: "Brasil", city: "Recife" },
    destinationAddress: { country: "Grécia", city: "Atenas" },
  },
  {
    id: 8,
    title: "Expedição Amazônica",
    description: "Explore a maior floresta do mundo com trilhas guiadas e passeios de barco.",
    price: 2299,
    originalPrice: 2499,
    duration: 11,
    image: "https://images.pexels.com/photos/29759408/pexels-photo-29759408.jpeg",
    rating: 4.6,
    reviews: 98,
    qtySalesLimit: 12,
    qtySold: 5,
    originAddress: { country: "Brasil", city: "Porto Alegre" },
    destinationAddress: { country: "Brasil", city: "Manaus" },
  },
]

const durations = ["All", "1-5 days", "6-10 days", "11+ days"]

// Extract unique origins and destinations
const origins = ["All", ...Array.from(new Set(travelPackages.map((pkg) => pkg.originAddress.city))).sort()]
const destinations = ["All", ...Array.from(new Set(travelPackages.map((pkg) => pkg.destinationAddress.city))).sort()]

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrigin, setSelectedOrigin] = useState("All")
  const [selectedDestination, setSelectedDestination] = useState("All")
  const [selectedDuration, setSelectedDuration] = useState("All")
  const [departureDate, setDepartureDate] = useState("")
  const [arrivalDate, setArrivalDate] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("featured")

  const filteredPackages = useMemo(() => {
    const filtered = travelPackages.filter((pkg) => {
      const matchesSearch = Object.values(pkg).some((value) => {
        if (typeof value === "object" && value !== null) {
          // Se for um objeto (ex: originAddress, destinationAddress), verifica os valores internos
          return Object.values(value).some((v) =>
            String(v).toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });

      const matchesOrigin = selectedOrigin === "All" || pkg.originAddress.city === selectedOrigin
      const matchesDestination = selectedDestination === "All" || pkg.destinationAddress.city === selectedDestination
      const matchesPrice = pkg.price >= minPrice && pkg.price <= maxPrice
      const matchesRating = pkg.rating >= minRating

      let matchesDuration = true
      if (selectedDuration !== "All") {
        if (selectedDuration === "1-5 days") matchesDuration = pkg.duration <= 5
        else if (selectedDuration === "6-10 days") matchesDuration = pkg.duration >= 6 && pkg.duration <= 10
        else if (selectedDuration === "11+ days") matchesDuration = pkg.duration >= 11
      }

      return matchesSearch && matchesOrigin && matchesDestination && matchesPrice && matchesRating && matchesDuration
    })

    // Sort packages
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "duration":
        filtered.sort((a, b) => a.duration - b.duration)
        break
      default:
        break
    }

    return filtered
  }, [searchTerm, selectedOrigin, selectedDestination, selectedDuration, minPrice, maxPrice, minRating, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedOrigin("All")
    setSelectedDestination("All")
    setSelectedDuration("All")
    setDepartureDate("")
    setArrivalDate("")
    setMinPrice(0)
    setMaxPrice(5000)
    setMinRating(0)
    setSortBy("featured")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <Navbar />
      </div>

      <div className="flex flex-col container mx-auto px-4 py-8 gap-2 mt-30 mb-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Pacotes de Viagem</h1>
        <p className="text-gray-600">Descubra destinos incríveis e crie memórias inesquecíveis</p>

        {/* Filter Bar */}
        <div className="mb-8">
          <div className="rounded-lg border bg-white text-gray-900 shadow-sm">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><FaSearch /></span>
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search packages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Origin */}
                <div>
                  <label htmlFor="origin-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Or
                  </label>
                  <div className="relative">
                    <select
                      id="origin-select"
                      value={selectedOrigin}
                      onChange={(e) => setSelectedOrigin(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                      {origins.map((origin) => (
                        <option key={origin} value={origin}>
                          {origin}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 pointer-events-none">
                      <FaChevronDown />
                    </span>
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label htmlFor="destination-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <select
                      id="destination-select"
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                      {destinations.map((destination) => (
                        <option key={destination} value={destination}>
                          {destination}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 pointer-events-none">
                      <FaChevronDown />
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="duration-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Duração
                  </label>
                  <div className="relative">
                    <select
                      id="duration-select"
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                      {durations.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 pointer-events-none">
                      <FaChevronDown />
                    </span>
                  </div>
                </div>

                {/* Clear Filters */}
                <div>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2 w-full"
                  >
                    <span className="mr-2"><ImCross /></span>
                    Limpar filtros
                  </button>
                </div>
              </div>

              {/* Second Row - Dates, Price, Rating, Sort */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200 items-end">
                {/* Departure Date */}
                <div>
                  <label htmlFor="departure-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de partida
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><FaCalendarAlt /></span>
                    <input
                      id="departure-date"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Arrival Date */}
                <div>
                  <label htmlFor="arrival-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de chegada
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><FaCalendarAlt /></span>
                    <input
                      id="arrival-date"
                      type="date"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Price Range (using two inputs) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Faixa de preço</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="flex h-10 w-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="flex h-10 w-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label htmlFor="min-rating-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Avaliações
                  </label>
                  <div className="relative">
                    <select
                      id="min-rating-select"
                      value={minRating.toString()}
                      onChange={(e) => setMinRating(Number.parseFloat(e.target.value))}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                      <option value="0">Todas as avaliações</option>
                      <option value="3">3+ ⭐</option>
                      <option value="3.5">3.5+ ⭐</option>
                      <option value="4">4+ ⭐</option>
                      <option value="4.5">4.5+ ⭐</option>
                    </select>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 pointer-events-none">
                      <FaChevronDown />
                    </span>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label htmlFor="sort-by-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <div className="relative">
                    <select
                      id="sort-by-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                      <option value="featured">Em alta</option>
                      <option value="price-low">Preço: menor para maior</option>
                      <option value="price-high">Preço: maior para menor</option>
                      <option value="rating">Mais bem avaliado</option>
                      <option value="duration">Duração</option>
                    </select>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 pointer-events-none">
                      <FaChevronDown />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredPackages.length} pacote{filteredPackages.length !== 1 ? "s" : ""} encontrados
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => (
            <TravelPackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* No Results */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-12 flex flex-col justify-center items-center">
            <div className="text-gray-400 mb-4">
              <span className="text-6xl"><FaSearch /></span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pacote encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar ou remover os filtros ativados</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
