"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
    FaUsers,
    FaEllipsisV,
    FaEdit,
    FaPowerOff,
    FaPlus,
    FaSearch,
    FaBed,
    FaDollarSign,
    FaHashtag,
    FaPlay,
    FaArrowLeft,
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"

// Interface para os tipos de quarto
interface RoomType {
    id: number
    name: string
    description: string
    pricePerNight: number
    maxOccupancy: number
    numberOfRoomsAvailable: number
    imageUrl: string
    isActive: boolean
    amenities: string[]
    roomNumbers: string[]
    hotelName: string
}

// Dados mockados para demonstração
const mockRoomTypes: RoomType[] = [
    {
        id: 1,
        name: "Quarto Standard Duplo",
        description: "Quarto confortável com duas camas de solteiro, ideal para amigos ou colegas de trabalho.",
        pricePerNight: 150.0,
        maxOccupancy: 2,
        numberOfRoomsAvailable: 15,
        imageUrl: "data:image/jpeg;base64,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",
        isActive: true,
        amenities: ["Wi-Fi", "Ar Condicionado", "TV", "Frigobar"],
        roomNumbers: ["101", "102", "103", "104", "105"],
        hotelName: "Grand Plaza Hotel",
    },
    {
        id: 2,
        name: "Suíte Família",
        description: "Ampla suíte com sala de estar separada, perfeita para famílias com crianças.",
        pricePerNight: 280.0,
        maxOccupancy: 4,
        numberOfRoomsAvailable: 8,
        imageUrl: "https://www.pullmanguarulhos.com/wp-content/uploads/sites/24/2022/10/familyroom1-370x276.jpg",
        isActive: true,
        amenities: ["Wi-Fi", "Ar Condicionado", "TV", "Frigobar", "Varanda", "Banheira"],
        roomNumbers: ["201", "202", "203", "204"],
        hotelName: "Grand Plaza Hotel",
    },
    {
        id: 3,
        name: "Quarto Executivo",
        description: "Quarto sofisticado com mesa de trabalho e comodidades premium para executivos.",
        pricePerNight: 220.0,
        maxOccupancy: 2,
        numberOfRoomsAvailable: 10,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaVCtwKbDwn1mFk9J2K0EvIvstLxw0bnLGOg&s",
        isActive: false,
        amenities: ["Wi-Fi", "Ar Condicionado", "TV", "Mesa de Trabalho", "Cofre"],
        roomNumbers: ["301", "302", "303"],
        hotelName: "Grand Plaza Hotel",
    },
    {
        id: 4,
        name: "Quarto Econômico",
        description: "Opção econômica com o essencial para uma estadia confortável.",
        pricePerNight: 89.0,
        maxOccupancy: 1,
        numberOfRoomsAvailable: 20,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvJhCi2nYM9tSNO85IgCFue_O_tP91MQOUjw&s",
        isActive: true,
        amenities: ["Wi-Fi", "TV"],
        roomNumbers: ["401", "402", "403", "404", "405", "406"],
        hotelName: "Grand Plaza Hotel",
    },
]

export default function RoomTypeManagement() {
    const [roomTypes, setRoomTypes] = useState<RoomType[]>(mockRoomTypes)
    const [filteredRoomTypes, setFilteredRoomTypes] = useState<RoomType[]>(mockRoomTypes)
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const navigate = useNavigate();

    // Filtrar tipos de quarto baseado no status e termo de busca
    useEffect(() => {
        let filtered = roomTypes

        // Filtro por status
        if (statusFilter === "active") {
            filtered = filtered.filter((room) => room.isActive)
        } else if (statusFilter === "inactive") {
            filtered = filtered.filter((room) => !room.isActive)
        }

        // Filtro por termo de busca
        if (searchTerm) {
            filtered = filtered.filter(
                (room) =>
                    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    room.description.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        setFilteredRoomTypes(filtered)
    }, [roomTypes, statusFilter, searchTerm])

    const handleToggleStatus = (roomTypeId: number) => {
        setRoomTypes((prev) => prev.map((room) => (room.id === roomTypeId ? { ...room, isActive: !room.isActive } : room)))
        setActiveDropdown(null)
    }

    const handleEdit = (roomTypeId: number) => {
        console.log("Editando tipo de quarto:", roomTypeId)
        // Aqui você implementaria a navegação para a tela de edição
        setActiveDropdown(null)
    }

    const handleNewRoomType = () => {
        navigate("/roomtype");
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const handleDropdownClick = (roomTypeId: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setActiveDropdown(activeDropdown === roomTypeId ? null : roomTypeId)
    }

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveDropdown(null)
        }
        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])

    return (
        <div className="min-h-screen p-6" style={{ background: "linear-gradient(to bottom, #003194, white)" }}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center mb-3">
                            <button
                                className="mr-2 text-blue-600 hover:text-blue-800"
                                onClick={() => navigate("/affiliatedashboard")}
                                aria-label="Voltar para Dashboard do Afiliado"
                            >
                                <FaArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 ">Gerenciar Tipos de Quarto</h1>
                                <p className="text-sm text-gray-500 mt-1">Gerencie os tipos de quarto do seu hotel</p>
                            </div>
                        </div>
                        <button
                            onClick={handleNewRoomType}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <FaPlus className="w-4 h-4" style={{ color: '#fff', fill: '#fff' }} />
                            Novo Quarto
                        </button>
                    </div>
                </div>

                {/* Filtros e Busca */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatusFilter("all")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Todos ({roomTypes.length})
                            </button>
                            <button
                                onClick={() => setStatusFilter("active")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === "active" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Ativos ({roomTypes.filter((r) => r.isActive).length})
                            </button>
                            <button
                                onClick={() => setStatusFilter("inactive")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === "inactive" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Inativos ({roomTypes.filter((r) => !r.isActive).length})
                            </button>
                        </div>

                        <div className="relative w-full sm:w-80">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar tipos de quarto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Lista de Tipos de Quarto */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredRoomTypes.map((roomType) => (
                        <div
                            key={roomType.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={roomType.imageUrl || "/placeholder.svg"}
                                    alt={roomType.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => handleDropdownClick(roomType.id, e)}
                                            className="h-8 w-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <FaEllipsisV className="h-4 w-4 text-gray-600" />
                                        </button>

                                        {activeDropdown === roomType.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleEdit(roomType.id)}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(roomType.id)}
                                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 ${
                                                            roomType.isActive ? "text-red-600" : "text-green-600"
                                                        }`}
                                                    >
                                                        {roomType.isActive ? (
                                                            <>
                                                                <FaPowerOff className="w-4 h-4 text-red-600" style={{ color: '#dc2626', fill: '#dc2626' }} />
                                                                Desativar
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaPlay className="w-4 h-4" />
                                                                Ativar
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute top-3 left-3">
                  <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                          roomType.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {roomType.isActive ? "Ativo" : "Inativo"}
                  </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-blue-800 mb-2 line-clamp-1">{roomType.name}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{roomType.description}</p>
                                </div>

                                {/* Informações principais */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaDollarSign className="w-4 h-4 text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Preço/noite</p>
                                            <p className="font-semibold text-green-600 text-sm">{formatCurrency(roomType.pricePerNight)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaUsers className="w-4 h-4 text-blue-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Ocupação máx.</p>
                                            <p className="font-semibold text-blue-600 text-sm">
                                                {roomType.maxOccupancy} pessoa{roomType.maxOccupancy > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaBed className="w-4 h-4 text-orange-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Quartos disp.</p>
                                            <p className="font-semibold text-orange-600 text-sm">{roomType.numberOfRoomsAvailable}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaHashtag className="w-4 h-4 text-purple-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Números</p>
                                            <p className="font-semibold text-purple-600 text-sm">{roomType.roomNumbers.length} cadastrados</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-600 mb-2">Diferenciais:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {roomType.amenities.slice(0, 3).map((amenity, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border">
                        {amenity}
                      </span>
                                        ))}
                                        {roomType.amenities.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border">
                        +{roomType.amenities.length - 3} mais
                      </span>
                                        )}
                                    </div>
                                </div>

                                {/* Números dos quartos (preview) */}
                                <div>
                                    <p className="text-xs text-gray-600 mb-2">Números dos quartos:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {roomType.roomNumbers.slice(0, 4).map((number, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                        {number}
                      </span>
                                        ))}
                                        {roomType.roomNumbers.length > 4 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{roomType.roomNumbers.length - 4}
                      </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Estado vazio */}
                {filteredRoomTypes.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                        <FaBed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum tipo de quarto encontrado</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || statusFilter !== "all"
                                ? "Tente ajustar os filtros de busca."
                                : "Comece cadastrando seu primeiro tipo de quarto."}
                        </p>
                        {!searchTerm && statusFilter === "all" && (
                            <button
                                onClick={handleNewRoomType}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                            >
                                <FaPlus className="w-4 h-4" />
                                Cadastrar Primeiro Tipo de Quarto
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
