"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaUsers, FaEllipsisV, FaEdit, FaPowerOff, FaPlus, FaSearch, FaBed, FaDollarSign, FaHashtag, FaArrowLeft } from "react-icons/fa"
import * as Md from "react-icons/md"
import { useNavigate } from "react-router-dom"
import apiClient from "../../utils/apiClient"
import { AuthService } from "../../utils/auth"

// Componente para renderizar ícone dinamicamente
const DynamicIcon = ({ iconName, size = 16, style }: { iconName: string; size?: number; style?: React.CSSProperties }) => {
    // Acessa o ícone dinamicamente do namespace Md
    const IconComponent = (Md as any)[iconName];

    if (!IconComponent) {
        return <Md.MdWifi size={size} style={style} />;
    }

    return <IconComponent size={size} style={style} />;
};

// Interface para os tipos de quarto (atualizada para refletir a API)
interface RoomType {
    roomTypeId: number
    hotelId: number
    name: string
    description: string
    imageUrl: string
    pricePerNight: number
    maxOccupancy: number
    numberOfRoomsAvailable: number
    numberOfRoomsReserved: number // Mock - não vem da API ainda
    createdAt: string
    isActive: boolean
    deletedAt: string | null
    rooms: any[]
    amenities: Array<{
        amenityId: number
        name: string
        iconName: string
    }>
}

export default function RoomTypeManagement() {
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
    const [filteredRoomTypes, setFilteredRoomTypes] = useState<RoomType[]>([])
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    // Buscar dados da API no carregamento
    useEffect(() => {
        fetchRoomTypes();
    }, []);

    const fetchRoomTypes = async () => {
        try {
            setLoading(true);

            // Verifica se está autenticado
            if (!AuthService.isAffiliateAuthenticated()) {
                navigate('/loginaffiliate');
                return;
            }

            // Busca todos os tipos de quarto
            const response = await apiClient.get('/roomtype');

            // Adiciona dados mockados para campos não disponíveis na API
            const roomTypesWithMockData = response.data.map((roomType: any) => ({
                ...roomType,
                // Mock para quartos reservados (não vem da API ainda)
                numberOfRoomsReserved: Math.floor(Math.random() * (roomType.numberOfRoomsAvailable || 5))
            }));

            setRoomTypes(roomTypesWithMockData);

            // Se tiver hotelId selecionado (pode vir de params ou estado), filtra
            const urlParams = new URLSearchParams(window.location.search);
            const hotelIdParam = urlParams.get('hotelId');

            if (hotelIdParam) {
                const hotelId = parseInt(hotelIdParam);
                const filteredByHotel = roomTypesWithMockData.filter((room: RoomType) => room.hotelId === hotelId);
                setFilteredRoomTypes(filteredByHotel);
            } else {
                setFilteredRoomTypes(roomTypesWithMockData);
            }

        } catch (error) {
            console.error('Erro ao buscar tipos de quarto:', error);
            // Se der erro de autenticação, redireciona
            if ((error as any)?.response?.status === 401) {
                AuthService.clearAffiliateAuth();
                navigate('/loginaffiliate');
            }
        } finally {
            setLoading(false);
        }
    };

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

    const handleToggleStatus = async (roomTypeId: number) => {
        try {
            const roomType = roomTypes.find(r => r.roomTypeId === roomTypeId);
            if (!roomType) return;

            if (roomType.isActive) {
                // Desativar: chama DELETE /api/roomtype/{id}
                await apiClient.delete(`/roomtype/${roomTypeId}`);

                // Atualiza o estado local
                setRoomTypes((prev) => prev.map((room) =>
                    room.roomTypeId === roomTypeId ? { ...room, isActive: false } : room
                ));

                console.log(`Tipo de quarto ${roomTypeId} desativado com sucesso`);
            } else {
                // Ativar: chama POST /api/roomtype/{id}/activate
                await apiClient.post(`/roomtype/${roomTypeId}/activate`, {});

                // Atualiza o estado local
                setRoomTypes((prev) => prev.map((room) =>
                    room.roomTypeId === roomTypeId ? { ...room, isActive: true } : room
                ));

                console.log(`Tipo de quarto ${roomTypeId} ativado com sucesso`);
            }
        } catch (error) {
            console.error('Erro ao alterar status do tipo de quarto:', error);
            alert('Erro ao alterar status do tipo de quarto. Tente novamente.');
        } finally {
            setActiveDropdown(null);
        }
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

    if (loading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-600"></div>
            </div>
        )
    }

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
                            key={roomType.roomTypeId}
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
                                            onClick={(e) => handleDropdownClick(roomType.roomTypeId, e)}
                                            className="h-8 w-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <FaEllipsisV className="h-4 w-4 text-gray-600" />
                                        </button>

                                        {activeDropdown === roomType.roomTypeId && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleEdit(roomType.roomTypeId)}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(roomType.roomTypeId)}
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
                                                                <FaPowerOff className="w-4 h-4 text-green-800" style={{ color: '#16a34a', fill: '#16a34a' }} />
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
                                        <FaBed className="w-4 h-4 text-red-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Reservados</p>
                                            <p className="font-semibold text-red-600 text-sm">{roomType.numberOfRoomsReserved}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaHashtag className="w-4 h-4 text-purple-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Números</p>
                                            <p className="font-semibold text-purple-600 text-sm">{roomType.rooms.length} cadastrados</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaBed className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Total</p>
                                            <p className="font-semibold text-gray-600 text-sm">{roomType.numberOfRoomsAvailable + roomType.numberOfRoomsReserved}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities com ícones dinâmicos */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-600 mb-2">Diferenciais:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {roomType.amenities.slice(0, 3).map((amenity, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs border flex items-center gap-1">
                                                <DynamicIcon iconName={amenity.iconName} size={12} style={{ color: 'white', fill: 'white' }} />
                                                {amenity.name}
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
                                        {roomType.rooms.slice(0, 4).map((room, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                        {room.roomNumber}
                      </span>
                                        ))}
                                        {roomType.rooms.length > 4 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{roomType.rooms.length - 4}
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
