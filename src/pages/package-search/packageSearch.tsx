import { useState, useMemo, useEffect } from "react";
import TravelPackageCard from "../../components/TravelPackageCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaCalendarAlt, FaChevronDown, FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Slider from '@mui/material/Slider';
import { travelPackages } from "../../mocks/travelPackagesMock";
import { validateArrivalAfterDeparture } from "../../utils/validations";
import type { TravelPackage } from "../../types/travelPackageTypes";

const durations = ["Todos", "1-5 dias", "6-10 dias", "11+ dias"]
const origins = ["Todos", ...Array.from(new Set(travelPackages.map((pkg) => pkg.originCity))).sort()]
const destinations = ["Todos", ...Array.from(new Set(travelPackages.map((pkg) => pkg.destinationCity))).sort()]

export default function PackagesPage() {
  const [travelPackages, setTravelPackages] = useState<TravelPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrigin, setSelectedOrigin] = useState("Todos")
  const [selectedDestination, setSelectedDestination] = useState("Todos")
  const [selectedDuration, setSelectedDuration] = useState("Todos")
  const [departureDate, setDepartureDate] = useState("")
  const [arrivalDate, setArrivalDate] = useState("")
  const maxPackagePrice = Math.max(...travelPackages.map(pkg => pkg.price))
  const [priceRange, setPriceRange] = useState([0, maxPackagePrice]);
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("featured")
  const isArrivalValid = validateArrivalAfterDeparture(departureDate, arrivalDate);

  // Fetch packages from API
  useEffect(() => {
    fetch("https://viagium.azurewebsites.net/api/TravelPackage/list-active")
      .then(res => res.json())
      .then(data => {
        const mappedPackages = data.map((apiPkg: any) => ({
          id: apiPkg.travelPackageId,
          title: apiPkg.title,
          description: apiPkg.description,
          image: apiPkg.imageUrl,
          vehicleType: apiPkg.vehicleType,
          duration: apiPkg.duration,
          maxPeople: apiPkg.maxPeople,
          confirmedPeople: apiPkg.confirmedPeople,
          originalPrice: apiPkg.originalPrice,
          price: apiPkg.price,
          packageTax: apiPkg.packageTax,
          cupomDiscount: apiPkg.cupomDiscount,
          discountValue: apiPkg.discountValue,
          manualDiscountValue: apiPkg.manualDiscountValue,
          startDate: apiPkg.startDate,
          isAvailable: apiPkg.isAvailable,
          originCity: apiPkg.originCity,
          originCountry: apiPkg.originCountry,
          destinationCity: apiPkg.destinationCity,
          destinationCountry: apiPkg.destinationCountry,
          createdAt: apiPkg.createdAt,
          isActive: apiPkg.isActive,
        }));
        setTravelPackages(mappedPackages);
        const maxPrice = Math.max(...mappedPackages.map((pkg: TravelPackage) => pkg.price));
        setPriceRange([0, maxPrice]);
      });
  }, []);

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

      const matchesOrigin = selectedOrigin === "Todos" || pkg.originCity === selectedOrigin
      const matchesDestination = selectedDestination === "Todos" || pkg.destinationCity === selectedDestination
      const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1]

      let matchesDuration = true
      if (selectedDuration !== "Todos") {
        if (selectedDuration === "1-5 dias") matchesDuration = pkg.duration <= 5
        else if (selectedDuration === "6-10 dias") matchesDuration = pkg.duration >= 6 && pkg.duration <= 10
        else if (selectedDuration === "11+ dias") matchesDuration = pkg.duration >= 11
      }

      let matchesDates = true;
      if (departureDate || arrivalDate) {
        const start = new Date(pkg.startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + pkg.duration);

        const depDate = departureDate ? new Date(departureDate) : null;
        const arrDate = arrivalDate ? new Date(arrivalDate) : null;

        if (depDate && arrDate) {
          matchesDates = start >= depDate && end <= arrDate;
        } else if (depDate) {
          matchesDates = start >= depDate;
        } else if (arrDate) {
          matchesDates = end <= arrDate;
        }
      }

      return matchesSearch && matchesOrigin && matchesDestination && matchesPrice && matchesDuration && matchesDates;
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

        break
      case "duration":
        filtered.sort((a, b) => a.duration - b.duration)
        break
      default:
        break
    }

    return filtered
  }, [
    searchTerm,
    selectedOrigin,
    selectedDestination,
    selectedDuration,
    priceRange,
    minRating,
    sortBy,
    departureDate,
    arrivalDate
  ])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedOrigin("Todos")
    setSelectedDestination("Todos")
    setSelectedDuration("Todos")
    setDepartureDate("")
    setArrivalDate("")
    setPriceRange([0, maxPackagePrice])
    setMinRating(0)
    setSortBy("featured")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <Navbar />
      </div>

      <div className="flex flex-col container mx-auto px-4 py-8 gap-2 mt-21 mb-20">

        <div className="mt-5">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pacotes de Viagem</h1>
          <p className="text-gray-600">Descubra destinos incríveis e crie memórias inesquecíveis</p>
        </div>


        {/* Filter Bar */}
        <div className="mb-8">
          <div className="rounded-lg border bg-white text-gray-900 shadow-sm">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Pesquisa
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><FaSearch /></span>
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Procure por pacotes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Origin */}
                <div>
                  <label htmlFor="origin-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Origem
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
                    Destino
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
              </div>

              {/* Second Row - Dates, Price, Rating, Sort */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200 items-start">
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
                  {!isArrivalValid && (
                    <span className="text-red-500 text-sm">A data de chegada deve ser igual ou posterior à partida.</span>
                  )}
                </div>

                {/* Price Range (using two inputs) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Faixa de preço</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onChange={(_, newValue) => setPriceRange(newValue as number[])}
                      min={0}
                      max={maxPackagePrice}
                      step={100}
                      valueLabelDisplay="auto"
                      sx={{ width: '100%' }}
                    />

                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label htmlFor="sort-by-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
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
                      <option value="duration">Duração</option>
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
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2 mt-[28px] w-full"
                  >
                    <span className="mr-2"><ImCross /></span>
                    Limpar filtros
                  </button>
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