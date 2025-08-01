import { FaPlus, FaUser, FaStar, FaEllipsisV, FaEdit, FaPowerOff, FaBed, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { useState, useEffect } from 'react'
import ModalHotel from "./components/ModalHotel"
import ModalEditHotel from "./components/ModalEditHotel"
import apiClient from "../../utils/apiClient"
import { AuthService } from "../../utils/auth"

// Dados para os gráficos
const monthlyReservationsData = [
  { month: "Jan", reservations: 45 },
  { month: "Fev", reservations: 65 },
  { month: "Mar", reservations: 35 },
  { month: "Abr", reservations: 55 },
  { month: "Mai", reservations: 75 },
  { month: "Jul", reservations: 85 },
]

const monthlyEarningsData = [
  { month: "Jan", earnings: 1200 },
  { month: "Fev", earnings: 800 },
  { month: "Mar", earnings: 1500 },
  { month: "Abr", earnings: 900 },
  { month: "Mai", earnings: 1800 },
  { month: "Jun", earnings: 1400 },
  { month: "Jul", earnings: 2000 },
]

const chartConfig = {
  reservations: {
    label: "Reservas",
    color: "#f59e0b",
  },
  earnings: {
    label: "Ganhos",
    color: "#f59e0b",
  },
}

// Dados base dos hotéis (ALTERAÇÃO AQUI)
const hotelsData = [
  { name: "Grand Plaza Hotel", available: 118, total: 355 },
  { name: "Blue Ocean Resort", available: 85, total: 250 },
  { name: "Mountain View", available: 45, total: 150 },
  { name: "City Center Hotel", available: 92, total: 200 },
]

// Cálculo automático dos quartos ocupados (ALTERAÇÃO AQUI)
const hotels = hotelsData.map(hotel => ({
  ...hotel,
  occupied: hotel.total - hotel.available,
  percentage: Math.round((hotel.available / hotel.total) * 100)
}))

function AffiliateDashboard() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [affiliateName, setAffiliateName] = useState<string>("");
  const [yourHotels, setYourHotels] = useState<any[]>([]);

  // Modal Hotel Handle Abrir e fechar
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal Edit Hotel Handle Abrir e fechar
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  // Dados das reservas
  const reservations = [
    {
      room: "Quarto Família",
      hotel: "Grand Plaza Hotel",
      guest: "Maria Silva",
      dates: "19/07/2025 - 24/07/2025",
      price: "R$1.200",
      purchaseDate: "Comprado no dia 14/06/2025",
      status: "Confirmada",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      room: "Quarto Família",
      hotel: "Grand Plaza Hotel",
      guest: "Maria Silva",
      dates: "19/07/2025 - 24/07/2025",
      price: "R$1.200",
      purchaseDate: "Comprado no dia 14/06/2025",
      status: "Pendente",
      statusColor: "bg-orange-100 text-orange-800",
    },
    {
      room: "Quarto Família",
      hotel: "Grand Plaza Hotel",
      guest: "Maria Silva",
      dates: "19/07/2025 - 24/07/2025",
      price: "R$1.200",
      purchaseDate: "Comprado no dia 14/06/2025",
      status: "Confirmada",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      room: "Quarto Família",
      hotel: "Grand Plaza Hotel",
      guest: "Maria Silva",
      dates: "19/07/2025 - 24/07/2025",
      price: "R$1.200",
      purchaseDate: "Comprado no dia 14/06/2025",
      status: "Confirmada",
      statusColor: "bg-green-100 text-green-800",
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenEditModal = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedHotel(null);
  };

  const handleSaveHotel = (updatedHotel: any) => {
    setYourHotels(prevHotels => 
      prevHotels.map(h => h.id === updatedHotel.id ? updatedHotel : h)
    );
  };

  const handleDropdownClick = (filteredIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === filteredIndex ? null : filteredIndex);
  };

  // Verificar autenticação no carregamento da página
  useEffect(() => {
    // Verifica se o afiliado está autenticado
    if (!AuthService.isAffiliateAuthenticated()) {
      // Se não estiver autenticado, redireciona para login
      window.location.href = '/affiliate';
      return;
    }

    // Recupera os dados de autenticação do afiliado
    const affiliateAuth = AuthService.getAffiliateAuth();
    if (affiliateAuth && affiliateAuth.id) {
      // Busca dados do afiliado usando o apiClient (que já inclui o token automaticamente)
      apiClient.get(`/Affiliate/${affiliateAuth.id}`)
        .then(res => {
          if (res.data) {
            // Nome do afiliado
            if (res.data.name) setAffiliateName(res.data.name);
            // Monta o array de hotéis
            if (res.data.hotels && Array.isArray(res.data.hotels)) {
              const hotelsMapped = res.data.hotels.map((hotel: any) => ({
                id: hotel.hotelId,
                name: hotel.name || "",
                location: hotel.address ? `${hotel.address.city}, ${hotel.address.country}` : "",
                status: hotel.isActive ? "Ativo" : "Inativo",
                image: hotel.imageUrl || ""
              }));
              setYourHotels(hotelsMapped);
            } else {
              setYourHotels([]);
            }
          }
        })
        .catch(error => {
          console.error('Erro ao buscar dados do afiliado:', error);
          // Se for erro de autenticação, o interceptor já vai redirecionar
          if (error.response?.status !== 401) {
            setAffiliateName("");
            setYourHotels([]);
          }
        });
    }
  }, []);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
      setIsUserDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Pega o token atual para enviar na requisição de logout
    const affiliateAuth = AuthService.getAffiliateAuth();

    if (affiliateAuth && affiliateAuth.token) {
      // Chama a API de logout primeiro
      apiClient.post('/Affiliate/logout', {
        token: affiliateAuth.token
      })
      .then(() => {
        // Se o logout na API foi bem-sucedido, limpa os dados locais
        AuthService.clearAffiliateAuth();
        // Redireciona para login
        window.location.href = '/affiliate';
      })
      .catch((error) => {
        console.error('Erro ao fazer logout na API:', error);
        // Mesmo se der erro na API, limpa os dados locais
        AuthService.clearAffiliateAuth();
        window.location.href = '/affiliate';
      });
    } else {
      // Se não tiver token, apenas limpa os dados locais
      AuthService.clearAffiliateAuth();
      window.location.href = '/affiliate';
    }
  };

  const handleActivateHotel = (hotel: any) => {
    if (!hotel || !hotel.id) return;

    // Usa o apiClient que já inclui automaticamente o token Bearer
    apiClient.put(`/Hotel/${hotel.id}/activate`)
      .then(() => {
        setYourHotels(prevHotels => prevHotels.map(h =>
          h.id === hotel.id ? { ...h, status: "Ativo" } : h
        ));
        setActiveDropdown(null);
      })
      .catch((error) => {
        console.error('Erro ao ativar hotel:', error);
        alert("Erro ao ativar hotel.");
        setActiveDropdown(null);
      });
  };

  const handleEditHotel = (hotel: typeof yourHotels[0]) => {
    console.log('Editando hotel:', hotel.name);
    handleOpenEditModal(hotel);
    setActiveDropdown(null);
  };

  const handleManageRooms = (hotelId?: number) => {
    setActiveDropdown(null);
    // Passa o hotelId como parâmetro na URL
    if (hotelId) {
      window.location.href = `/roomtypemanagement?hotelId=${hotelId}`;
    } else {
      window.location.href = "/roomtypemanagement";
    }
  };

  const handleDeactivateHotel = (hotel: any) => {
    if (!hotel || !hotel.id) return;

    // Usa o apiClient que já inclui automaticamente o token Bearer
    apiClient.delete(`/Hotel/${hotel.id}/desactivate`)
      .then(() => {
        setYourHotels(prevHotels => prevHotels.map(h =>
          h.id === hotel.id ? { ...h, status: "Inativo" } : h
        ));
        setActiveDropdown(null);
      })
      .catch((error) => {
        console.error('Erro ao desativar hotel:', error);
        alert("Erro ao desativar hotel.");
        setActiveDropdown(null);
      });
  };

  return (
      <div className="min-h-screen bg-gradient-to-b to-white p-6"
           style={{
             background: 'linear-gradient(to bottom, #003194, white)'
           }}>
        <div className="max-w-7xl mx-auto space-y-6 rounded-xl bg-white/10">
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-lg">
            {/* Logo e título */}
            <div className="flex items-center gap-3">
              <div className="flex items-center flex-shrink-0">
                <img
                    src="/src/assets/img/logo.svg"
                    alt="Viagium Logo"
                    className="h-12"
                />
              </div>
              {/* Header - Afiliado Viagium */}
              <h1 className="text-2xl font-bold">Afiliado Viagium</h1>
            </div>

            {/* Botões e perfil */}
            <div className="flex items-center gap-4">
              <button onClick={handleOpenModal} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                <FaPlus className="w-4 h-4" />
                Add Hotel
              </button>
              {/* Chamada do Modal de cadastro Hotel */}
              <ModalHotel
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
              />
              
              {/* Chamada do Modal de edição Hotel */}
              <ModalEditHotel
                  isOpen={isEditModalOpen}
                  onClose={handleCloseEditModal}
                  hotel={selectedHotel}
                  onSave={handleSaveHotel}
              />

              <div className="flex items-center gap-2 text-gray-600 relative">
                <span className="text-sm">Bem vindo{affiliateName ? ` ${affiliateName}` : ""}</span>
                <button
                  onClick={e => { e.stopPropagation(); setIsUserDropdownOpen((open) => !open); }}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  type="button"
                >
                  <FaUser className="w-4 h-4" />
                </button>

                {/* Dropdown do usuário */}
                {isUserDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-2">
                        <button
                            onClick={e => { e.stopPropagation(); handleLogout(); }}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            type="button"
                        >
                          <FaPowerOff className="w-4 h-4" />
                          Sair
                        </button>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Available Rooms Chart */}
              <div className="flex flex-col justify-between bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold">Quartos disponíveis</h2>
                <p className="text-sm text-gray-500">Quantidade por hotel</p>
                <div className="h-48 mr-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={hotels}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <XAxis type="number" />
                      <YAxis
                          type="category"
                          dataKey="name"
                          width={120}
                          tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                          formatter={(value, name) => [`${value} quartos`, name]}
                          contentStyle={{ fontSize: 12 }}
                      />
                      <Legend />
                      <Bar
                          dataKey="available"
                          stackId="a"
                          fill="#4ade80"
                          name="Disponíveis"
                      />
                      <Bar
                          dataKey="occupied"
                          stackId="a"
                          fill="#f87171"
                          name="Ocupados"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Reservations Chart */}
              <div className="flex flex-col justify-between bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold">Reservas mensais</h2>
                <p className="text-sm text-gray-500">Número total de reservas por mês</p>
                <div className="h-48 mr-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyReservationsData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reservations" fill={chartConfig.reservations.color} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Earnings Chart */}
              <div className="flex flex-col justify-between bg-white rounded-2xl p-6 shadow-lg gap-2">
                <h2 className="text-lg font-semibold">Ganhos mensais</h2>
                <p className="text-sm text-gray-500">Lucro por mês</p>
                <div className="h-48 mr-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyEarningsData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                          type="monotone"
                          dataKey="earnings"
                          stroke={chartConfig.earnings.color}
                          strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Hotels and Reservations Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Hotels List */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Seus Hotéis</h2>
                    <p className="text-sm text-gray-500">Gerencie seus hotéis registrados</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                        onClick={() => setStatusFilter('Ativo')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'Ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      Ativos
                    </button>
                    <button
                        onClick={() => setStatusFilter('Inativo')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'Inativo'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      Inativos
                    </button>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col gap-2">
                  {yourHotels
                      .filter(hotel => hotel.status === statusFilter)
                      .map((hotel, filteredIndex) => (
                          <div key={filteredIndex} className="flex items-center gap-4 p-3 border border-orange-300 rounded-lg">
                            <img
                                src={hotel.image}
                                alt={`${hotel.name} thumbnail`}
                                className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-blue-800 truncate">{hotel.name}</h3>
                                  <p className="text-sm text-blue-800">{hotel.location}</p>
                                </div>

                                {/* Dropdown Menu */}
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                  <button
                                      onClick={(e) => handleDropdownClick(filteredIndex, e)}
                                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                      type="button"
                                  >
                                    <FaEllipsisV className="text-gray-600 w-4 h-4" />
                                  </button>

                                  {activeDropdown === filteredIndex && (
                                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                                        <div className="py-1">
                                          {statusFilter === 'Ativo' ? (
                                              <>
                                                <button
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                                    onClick={() => handleEditHotel(hotel)}
                                                >
                                                  <FaEdit className="text-blue-600" />
                                                  <span>Editar hotel</span>
                                                </button>

                                                <button
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                                    onClick={() => handleManageRooms(hotel.id)}
                                                >
                                                  <FaBed className="text-orange-600" />
                                                  <span>Gerenciar tipos de quarto</span>
                                                </button>

                                                <button
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                                                    onClick={() => {
                                                      console.log('Desativar hotel clicado', hotel);
                                                      handleDeactivateHotel(hotel);
                                                      setActiveDropdown(null);
                                                    }}
                                                    type="button"
                                                >
                                                  <FaPowerOff className="text-red-600" />
                                                  <span>Desativar hotel</span>
                                                </button>
                                              </>
                                          ) : (
                                              <button
                                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-green-600"
                                                  onClick={() => {
                                                    console.log('Ativar hotel clicado', hotel);
                                                    handleActivateHotel(hotel);
                                                    setActiveDropdown(null);
                                                  }}
                                                  type="button"
                                              >
                                                <FaPowerOff className="text-green-600" />
                                                <span>Ativar hotel</span>
                                              </button>
                                          )}
                                        </div>
                                      </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <FaStar className="w-3 h-3 text-yellow-400 fill-current" />
                                  {/* <span className="text-sm font-medium">{hotel.rating}</span> */}

                                </div>
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${hotel.status === "Ativo"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                >
                            {hotel.status}
                          </span>
                              </div>
                            </div>
                          </div>
                      ))}
                </div>
              </div>

              {/* Recent Reservations */}
              <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Reservas Recentes</h2>
                <p className="text-sm text-gray-500 mb-4">Últimas reservas e check-ins das hospedagens</p>

                <div className="space-y-3 flex flex-col gap-2">
                  {reservations.map((reservation, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-orange-300 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-blue-800">{reservation.room}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${reservation.statusColor}`}>
                          {reservation.status}
                        </span>
                          </div>

                          <div className="flex items-center gap-2 mb-1">
                            <FaMapMarkerAlt className="w-3 h-3 text-blue-800" />
                            <p className="text-sm text-blue-800">{reservation.hotel}</p>
                          </div>

                          <div className="flex items-center gap-2 mb-1">
                            <FaUser className="w-3 h-3 text-blue-800" />
                            <p className="text-sm text-blue-800">{reservation.guest}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="w-3 h-3 text-blue-800" />
                            <p className="text-sm text-blue-800">{reservation.dates}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold" style={{ color: '#003194' }}>{reservation.price}</p>
                          <p className="text-xs text-blue-800">{reservation.purchaseDate}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default AffiliateDashboard;
