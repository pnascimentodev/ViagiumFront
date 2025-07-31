import { useState, useEffect } from 'react';
import italyImg from '../../assets/img/italy.jpg';
import veneza1Img from '../../assets/img/veneza1.jpg';
import { Button } from '../../components/Button';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoPersonCircleOutline } from 'react-icons/io5';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useNavigate, useParams } from "react-router-dom";
import Footer from '../../components/Footer';


function Package() {

  // Interfaces para dados da API
  interface TravelPackage {
    id: number;
    title: string;
    description: string;
    originCity: string;
    originCountry: string;
    destinationCity: string;
    destinationCountry: string;
    vehicleType: string;
    originalPrice: number;
    price: number;
    packageTax: number;
    discountValue: number;
    duration: string | number;
    imageUrl?: string;
    images?: string[];
    hotels?: Hotel[]; // Hotéis podem vir junto com o pacote
  }

  interface Hotel {
    id: number;
    name: string;
    address: any; // pode ser string ou objeto
    rating: number;
    imageUrl?: string;
    roomTypes: RoomType[];
    amenities?: Amenity[]; // amenities do hotel
  }
  // Função utilitária para formatar endereço do hotel
  const renderHotelAddress = (address: any) => {
    if (!address) return 'Endereço não disponível';
    if (typeof address === 'string') return address;
    // Se for objeto, monta string
    return [
      address.streetName,
      address.addressNumber,
      address.neighborhood,
      address.city,
      address.state,
      address.zipCode,
      address.country
    ].filter(Boolean).join(', ');
  };

  interface RoomType {
    roomTypeId: number;
    hotelId: number;
    name: string;
    description?: string;
    imageUrl?: string;
    pricePerNight: number;
    maxOccupancy: number;
    numberOfRoomsAvailable?: number;
    createdAt?: string;
    isActive?: boolean;
    deletedAt?: string | null;
    rooms?: any[];
    amenities: Amenity[];
  }

  interface Amenity {
    id?: number;
    amenityId?: number;
    name: string;
    iconName: string;
    type?: 'hotel' | 'room';
  }

  interface Review {
    id: number;
    userId: number;
    userName: string;
    userAvatar?: string;
    packageId: number;
    packageName: string;
    rating: number;
    title?: string;
    comment: string;
    createdAt: string;
    isVerified: boolean;
    helpfulCount?: number;
  }

  interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  }

    const navigate = useNavigate();
    const { packageId } = useParams<{ packageId: string }>();
    const [numPessoas, setNumPessoas] = useState(1);
    const [cupomDiscountInput, setCupomDiscountInput] = useState('');
    const [packageImageIndex, setPackageImageIndex] = useState(0);
    const [hotelImageIndex, setHotelImageIndex] = useState(0);
    const [roomTypeIndex, setRoomTypeIndex] = useState(0);
    const [roomTypeDetail, setRoomTypeDetail] = useState<RoomType | null>(null);
  // Buscar detalhes do tipo de quarto pelo ID
  const fetchRoomTypeById = async (roomTypeId: number) => {
    try {
      const response = await axios.get(`http://localhost:5028/api/roomtype/${roomTypeId}`);
      setRoomTypeDetail(response.data);
      console.log('🛏️ Detalhe do tipo de quarto carregado:', response.data);
    } catch (error) {
      setRoomTypeDetail(null);
      console.error('❌ Erro ao buscar detalhes do tipo de quarto:', error);
    }
  };
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [showAvaliacoesModal, setShowAvaliacoesModal] = useState(false);
    
    // Estados para dados da API
    const [currentPackage, setCurrentPackage] = useState<TravelPackage | null>(null);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [hotelAmenities, setHotelAmenities] = useState<Amenity[]>([]);
    const [roomAmenities, setRoomAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const openHotelModal = () => setShowHotelModal(true);
    const closeHotelModal = () => setShowHotelModal(false);
    const openAvaliacoesModal = () => setShowAvaliacoesModal(true);
    const closeAvaliacoesModal = () => setShowAvaliacoesModal(false);

  // Funções para buscar dados da API
  const fetchTravelPackage = async (packageId: number) => {
  setLoading(true);
  setError('');
  
  console.log('🔄 Iniciando busca do pacote ID:', packageId);
  
  try {
    const response = await axios.get(`http://localhost:5028/api/TravelPackage/getById/${packageId}`, {
      headers: {
        'accept': '*/*'
      }
    });
    
    console.log('✅ Resposta da API do pacote:', response.data);
    
    if (response.data) {
      setCurrentPackage(response.data);
      
      // Se o pacote incluir hotéis, configure-os
      if (response.data.hotels && response.data.hotels.length > 0) {
        setHotels(response.data.hotels);
        console.log('🏨 Hotéis carregados do pacote:', response.data.hotels.length);
      } else {
        console.log('📦 Pacote não inclui hotéis');
        setHotels([]); // Limpa hotéis se não houver
      }
      
      console.log('📦 Pacote carregado com sucesso:', response.data.title);
    }
  } catch (error: unknown) {
    console.error('❌ Erro ao buscar pacote:', error);
    if (axios.isAxiosError(error)) {
      console.log('🔍 Status do erro:', error.response?.status);
      console.log('🔍 Dados do erro:', error.response?.data);
    }
    setError('Erro ao carregar dados do pacote. Verifique se a API está rodando.');
  } finally {
    setLoading(false);
  }
};


  const fetchHotelAmenities = async () => {
    try {
      console.log('🔄 Buscando amenities do hotel...');
      const response = await axios.get('http://localhost:5028/api/Amenity/Hotel');
      console.log('✅ Amenities do hotel carregadas:', response.data);
      setHotelAmenities(response.data);
    } catch (error: unknown) {
      console.error('❌ Erro ao buscar amenities do hotel:', error);
    }
  };

  const fetchRoomAmenities = async () => {
    try {
      console.log('🔄 Buscando amenities do quarto...');
      const response = await axios.get('http://localhost:5028/api/Amenity/TypeRoom');
      console.log('✅ Amenities do quarto carregadas:', response.data);
      setRoomAmenities(response.data);
    } catch (error: unknown) {
      console.error('❌ Erro ao buscar amenities do quarto:', error);
    }
  };

  // useEffect para carregar dados quando o componente monta
    useEffect(() => {
    const id = packageId ? parseInt(packageId) : 1;
    console.log('🚀 Package ID obtido:', id);
    console.log('📦 URL do packageId:', packageId);
    
    fetchTravelPackage(id);
    fetchHotelAmenities();
    fetchRoomAmenities();
  }, [packageId]);

  useEffect(() => {
    setPackageImageIndex(0);
    setHotelImageIndex(0);
    setRoomTypeIndex(0);
  }, [currentPackage]);

  useEffect(() => {
    setRoomTypeIndex(0);
  }, [hotelImageIndex]);

  // Calcular valores baseados nos dados da API

  const price = currentPackage ? currentPackage.price * numPessoas : 0;
  const originalPrice = currentPackage ? currentPackage.originalPrice * numPessoas : 0;
  const packageTax = currentPackage ? currentPackage.packageTax : 0;
  const discountValue = currentPackage ? currentPackage.discountValue : 0;
  const valorFinal = (price + packageTax) - discountValue;
  const pacoteImages = currentPackage?.images || currentPackage?.imageUrl ? [currentPackage.imageUrl] : [italyImg];



  // Função para obter amenities do hotel atual
  const getCurrentHotelAmenities = () => {
    if (!hotels[hotelImageIndex]) return [];
    const hotelAmenitiesArr = Array.isArray(hotels[hotelImageIndex].amenities) ? hotels[hotelImageIndex].amenities : [];
    if (hotelAmenitiesArr.length > 0) {
      return hotelAmenitiesArr;
    }
    // Se não houver amenities no hotel, retorna todas as amenities globais de hotel
    return Array.isArray(hotelAmenities) ? hotelAmenities.filter(amenity => amenity.type === 'hotel' || !amenity.type) : [];
  };

  // Função para obter amenities do tipo de quarto atual
  const getCurrentRoomTypeAmenities = () => {
    // Se buscou detalhes do tipo de quarto, prioriza as amenities vindas da API
    if (roomTypeDetail && Array.isArray(roomTypeDetail.amenities) && roomTypeDetail.amenities.length > 0) {
      return roomTypeDetail.amenities;
    }
    if (!hotels[hotelImageIndex]?.roomTypes?.[roomTypeIndex]) return [];
    return hotels[hotelImageIndex].roomTypes[roomTypeIndex].amenities || 
           roomAmenities.filter(amenity => amenity.type === 'room') || 
           [];
  };
  // Buscar detalhes do tipo de quarto ao trocar o quarto selecionado
  useEffect(() => {
    if (hotels[hotelImageIndex]?.roomTypes?.[roomTypeIndex]) {
      const roomTypeId = hotels[hotelImageIndex].roomTypes[roomTypeIndex].roomTypeId;
      fetchRoomTypeById(roomTypeId);
    } else {
      setRoomTypeDetail(null);
    }
  }, [hotelImageIndex, roomTypeIndex, hotels]);

    useEffect(() => {
    setRoomTypeIndex(0);
  }, [numPessoas, hotelImageIndex]);

    // Adicione esses estados no componente Package
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      userId: 1,
      userName: "Maria Silva",
      userAvatar: "MS",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 5,
      title: "Experiência incrível!",
      comment: "O pacote superou todas as expectativas. Os hotéis eram excelentes e os passeios muito bem organizados. Recomendo para todos!",
      createdAt: "2024-01-15T10:30:00Z",
      isVerified: true,
      helpfulCount: 12
    },
    {
      id: 2,
      userId: 2,
      userName: "João Santos",
      userAvatar: "JS",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 4,
      title: "Muito bom!",
      comment: "Apenas alguns pequenos atrasos nos voos, mas no geral foi uma viagem fantástica. A equipe de suporte foi muito prestativa.",
      createdAt: "2024-01-08T14:22:00Z",
      isVerified: true,
      helpfulCount: 8
    },
    {
      id: 3,
      userId: 3,
      userName: "Ana Costa",
      userAvatar: "AC",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 5,
      title: "Perfeito!",
      comment: "Perfeito do início ao fim! Cada detalhe foi cuidadosamente planejado. As cidades visitadas eram deslumbrantes e os guias muito conhecedores.",
      createdAt: "2024-01-02T09:15:00Z",
      isVerified: true,
      helpfulCount: 15
    },
    {
      id: 4,
      userId: 4,
      userName: "Carlos Oliveira",
      userAvatar: "CO",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 4,
      title: "Boa experiência",
      comment: "Boa experiência geral. Os hotéis eram confortáveis e as refeições deliciosas. Apenas senti falta de mais tempo livre para explorar por conta própria.",
      createdAt: "2023-12-28T16:45:00Z",
      isVerified: true,
      helpfulCount: 6
    },
    {
      id: 5,
      userId: 5,
      userName: "Fernanda Lima",
      userAvatar: "FL",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 5,
      title: "Simplesmente mágico!",
      comment: "Veneza é realmente mágica! O passeio de gôndola foi inesquecível. A organização do pacote foi impecável e todos os detalhes foram cuidados.",
      createdAt: "2024-01-20T11:15:00Z",
      isVerified: true,
      helpfulCount: 9
    },
    {
      id: 6,
      userId: 6,
      userName: "Roberto Mendes",
      userAvatar: "RM",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 4,
      title: "Muito satisfeito",
      comment: "Excelente custo-benefício. Os hotéis tinham boa localização e o atendimento foi sempre cordial. Voltaria a viajar com esta empresa.",
      createdAt: "2024-01-12T15:45:00Z",
      isVerified: true,
      helpfulCount: 7
    }
  ]);

  const [reviewStats] = useState<ReviewStats>({
    totalReviews: 6,
    averageRating: 4.5,
    ratingDistribution: {
      5: 3,
      4: 3,
      3: 0,
      2: 0,
      1: 0
    }
  });

  const [loadingReviews] = useState(false);
  const [reviewsError] = useState('');

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Função para renderizar estrelas
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, idx) => (
        <svg 
          key={idx} 
          className={sizeClasses[size]} 
          fill={idx < rating ? "#FFA62B" : "#E5E7EB"} 
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
        </svg>
      ))}
    </div>
  );
};

  // useEffect para carregar reviews quando o modal abrir - agora usa dados mockados
  useEffect(() => {
    if (showAvaliacoesModal) {
      // Simula carregamento, mas usa dados já mockados
      console.log('Modal de avaliações aberto - usando dados mockados');
    }
  }, [showAvaliacoesModal]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFA62B]"></div>
            <span className="ml-2 text-gray-600">Carregando pacote...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-700 text-center">{error}</p>
            <button 
              onClick={() => fetchTravelPackage(1)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 block mx-auto"
            >
              Tentar novamente
            </button>
          </div>
        ) : !currentPackage ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Pacote não encontrado</p>
          </div>
        ) : (
        <div className="max-w-2xl w-full bg-white mt-20 mb-20 rounded-xl shadow-2xl p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            {currentPackage.title}
          </h1>
          {/* Carrossel de Imagens do Pacote */}
          <div className="relative rounded-lg overflow-hidden mb-6">
            <img
              src={pacoteImages[packageImageIndex]}
              alt="Imagem do pacote"
              className="w-full h-64 object-cover"
            />
          </div>
          <p className="mb-6 leading-relaxed">
            {currentPackage.description}
          </p>
          <div className="grid md:grid-cols-2 gap-6 px-6">
            {/* Left Column - Information */} 
            <div className="space-y-6">
              {/* Travel Information */}
              <div>
                <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-md transition duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-4">Informações</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold">Tipo de veículo:&nbsp;</span>
                      <span>{currentPackage.vehicleType}</span>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold ">Origem:&nbsp;</span>
                      {currentPackage.originCity && currentPackage.originCountry
                        ? `${currentPackage.originCity}, ${currentPackage.originCountry}`
                        : 'Não informado'}
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold ">Destino:&nbsp;</span>
                      {currentPackage.destinationCity && currentPackage.destinationCountry
                        ? `${currentPackage.destinationCity}, ${currentPackage.destinationCountry}`
                        : 'Não informado'}
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="font-semibold">Duração</h2>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <FaRegCalendarAlt className=" text-xl" />
                      <div className="w-full border rounded px-2 py-1">
                        {currentPackage.duration}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="font-semibold">Número de viajantes</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                      <IoPersonCircleOutline className="text-2xl" />
                          <select
                            className="w-full border rounded px-2 py-1"
                            value={numPessoas}
                            onChange={e => setNumPessoas(Number(e.target.value))}
                          >
                            <option value={1}>1 pessoa</option>
                            <option value={2}>2 pessoas</option>
                            <option value={3}>3 pessoas</option>
                            <option value={4}>4 pessoas</option>
                          </select>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FFFFFF] rounded-lg shadow-md mt-7 transition duration-300 hover:scale-105">
                  <div className="flex ml-4 mt-4">
                    <h3 className="text-lg font-semibold">Resumo</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                        <label htmlFor="cupom" className="font-semibold">Cupom de desconto</label>
                        <input
                          id="cupom"
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={cupomDiscountInput}
                          onChange={e => setCupomDiscountInput(e.target.value)}
                          placeholder="Insira seu cupom"
                        />
                  </div>
                    <div className="flex justify-between text-sm">
                      <span className="line-through color-red text-red-600 font-bold">Preço Original</span>
                      <span className="font-bold line-through text-red-600">{`R$ ${originalPrice.toLocaleString('pt-BR')},00`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">Pacote + Hospedagem</span>
                      <span className="font-bold">{`R$ ${price.toLocaleString('pt-BR')},00`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">Impostos e encargos:</span>
                      <span className="font-bold">{`R$ ${packageTax.toLocaleString('pt-BR')},00`}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Valor Final</span>
                      <span>{`R$ ${valorFinal.toLocaleString('pt-BR')},00`}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FFFFFF] rounded-lg shadow-md mt-7 transition duration-300 hover:scale-105 p-4">
                    <h3 className='font-bold mb-4 text-lg'>Avaliações do pacote</h3>
                      <Button
                        className="text-sm  px-4 py-2 rounded shadow font-bold hover:scale-101 transition-all duration-200 mb-4 "
                        onClick={openAvaliacoesModal}
                      >
                        Ver avaliações
                      </Button>
                </div>
              </div>
            </div>
            {/* Right Column - Hotel and Room */}
            <div className="rounded-xl p-2">
              <div className="space-y-6">
                {/* Hotel Section */}
                <div className="transition duration-300 hover:scale-105 bg-[#FFFFFF] rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-4 ">Hotel</h3>
                  <div className="space-y-4">
                    <select
                      className={`w-full border rounded px-2 py-1${showHotelModal ? ' hidden' : ''}`}
                      value={hotelImageIndex}
                      onChange={e => setHotelImageIndex(Number(e.target.value))}
                    >
                      {hotels.map((hotel, index) => (
                        <option key={index} value={index}>{hotel.name}</option>
                      ))}
                    </select>
                    <div className="flex justify-end mt-2">
                      <Button
                        className="w-full text-sm px-4 py-2 rounded shadow font-bold hover:scale-101 transition-all duration-200"
                        onClick={openHotelModal}
                      >
                        Ver detalhes do hotel
                      </Button>
                    </div>
                    <div className="rounded-xl p-2">
                      <div className="flex flex-col items-center">
                        <h4 className="font-semibold">{hotels[hotelImageIndex]?.name || 'Hotel não encontrado'}</h4>
                        <div className="flex items-center space-x-1 mb-1">
                          <svg className="w-5 h-5 inline" fill="#FFA62B" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                          </svg>
                          <span className="text-sm font-medium">{hotels[hotelImageIndex]?.rating || 'N/A'}</span>
                        </div>
                        {/* Imagem do hotel */}
                        <div className="relative rounded-lg overflow-hidden mb-6">
                          <img
                            src={hotels[hotelImageIndex]?.imageUrl || veneza1Img}
                            alt="Imagem do hotel"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                        {/* Endereço */}
                        <p className="text-sm text-gray-600 text-center mb-2">
                          {renderHotelAddress(hotels[hotelImageIndex]?.address)}
                        </p>
                        {/* Informações do hotel */}
                        <div className="p-6 pt-8">
                          <Button
                            className="w-full text-white font-bold py-4 text-lg shadow-lg hover:scale-105 transition-all duration-200" 
                          >
                            Ver no mapa
                          </Button>
                        </div>
                      </div>
                    </div>
                    {/* Quarto */}
                    <h3 className="text-lg font-semibold mb-2">Quarto</h3>
                    <div className="space-y-3 w-full">
                        {Array.isArray(hotels[hotelImageIndex]?.roomTypes) && hotels[hotelImageIndex].roomTypes.length > 0 ? (
                          <>
                            <select
                              className="w-full border rounded px-2 py-1"
                              value={roomTypeIndex}
                              onChange={e => setRoomTypeIndex(Number(e.target.value))}
                            >
                              {hotels[hotelImageIndex].roomTypes.map((roomType, realIdx) => (
                                <option key={roomType.roomTypeId} value={realIdx}>{roomType.name} - até {roomType.maxOccupancy} hóspedes</option>
                              ))}
                            </select>
                            <div className="justify-center mt-2">
                              <h5 className="font-semibold mb-1">Amenities:</h5>
                              <ul className="space-y-1">
                                {getCurrentRoomTypeAmenities().length > 0 ? (
                                  getCurrentRoomTypeAmenities().map((item) => (
                                    <li key={item.id ?? item.amenityId} className="text-gray-600 text-xs">{item.name}</li>
                                  ))
                                ) : (
                                  <li className="text-gray-400 text-xs">Nenhuma amenidade disponível para este quarto.</li>
                                )}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400 text-xs">Nenhum quarto disponível para este hotel.</div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 pt-8">
              <Button
                onClick={() => navigate("/reservation", { state: { numPessoas } })}
                className="w-full text-white font-bold py-4 text-lg rounded-2xl shadow-lg hover:scale-105 transition-all duration-200"
                style={{ backgroundColor: '#FFA62B', color: '#003194' }}
              >
                Reservar Agora
              </Button>
            </div>
          </div>
        </div>
        )}

        {showHotelModal && (
          <div className="fixed inset-0 flex justify-center items-center z-[99999]" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-lg p-6 max-w-xl w-full relative z-[100000]" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <button
                className="absolute top-2 right-2 text-gray-500 text-xl z-[100001]"
                onClick={closeHotelModal}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-2">{hotels[hotelImageIndex]?.name || 'Hotel não encontrado'}</h2>
              <img
                src={hotels[hotelImageIndex]?.imageUrl || veneza1Img}
                alt="Imagem do hotel"
                className="w-full h-48 object-cover rounded mb-4"
              />
              <p className="mb-2 text-xl">{renderHotelAddress(hotels[hotelImageIndex]?.address)}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Amenities do Hotel:</h4>
                  <ul className="mb-2">
                    {getCurrentHotelAmenities().map((item) => (
                      <li key={item.id} className="text-gray-600 text-xs">{item.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Amenities do Quarto:</h4>
                  <ul className="mb-2">
                    {getCurrentRoomTypeAmenities().map((item) => (
                      <li key={item.id} className="text-gray-600 text-xs">{item.name}</li>
                    ))}
                  </ul>
                </div>
                <span className="flex items-center font-semibold text-xl">
                  Avaliação:&nbsp;
                  <svg className="w-5 h-5 mr-1" fill="#FFA62B" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                  </svg>
                  <span className="font-medium">{hotels[hotelImageIndex]?.rating || 'N/A'}</span>
                </span>
            <div className="p-6 pt-8">
              <Button
                className="w-full text-font-bold py-4 text-lg rounded-2xl shadow-lg hover:scale-105 transition-all duration-200"
              >
                  Ver no mapa
              </Button>
            </div>
            </div>
          </div>
        )}
        
{showAvaliacoesModal && (
  <div className="fixed inset-0 flex justify-center items-center z-[99999]" style={{ background: 'rgba(0,0,0,0.5)' }}>
    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8 relative" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <button
        className="absolute top-4 right-4 text-gray-500 text-2xl font-bold hover:text-gray-700"
        onClick={closeAvaliacoesModal}
        aria-label="Fechar"
      >
        &times;
      </button>
      
      <h2 className="text-2xl font-bold text-center mb-8 text-[#003194]">
        Avaliações do Pacote
      </h2>

      {loadingReviews ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFA62B]"></div>
          <span className="ml-2 text-gray-600">Carregando avaliações...</span>
        </div>
      ) : reviewsError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-center">{reviewsError}</p>
          <button 
            onClick={() => console.log('Tentar novamente - usando dados mockados')}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 block mx-auto"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          {/* Estatísticas gerais */}
          {reviewStats && (
            <div className="bg-[#F8FAFC] rounded-lg shadow p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {renderStars(Math.round(reviewStats.averageRating), 'lg')}
                  <span className="text-2xl font-bold text-[#003194]">
                    {reviewStats.averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Baseado em {reviewStats.totalReviews} avaliações
                  </div>
                </div>
              </div>
              
              {/* Distribuição de avaliações */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviewStats.ratingDistribution[star as keyof typeof reviewStats.ratingDistribution];
                  const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                  
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-8">{star}★</span>
                      <div className="bg-gray-200 rounded-full h-2 flex-1">
                        <div
                          className="bg-[#FFA62B] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lista de avaliações */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-[#F8FAFC] rounded-lg shadow p-6 border border-gray-100">
                  <div className="flex gap-4">
                    <div className="bg-[#003194] rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {review.userAvatar || review.userName.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-bold text-[#003194] text-lg">
                            {review.userName}
                            {review.isVerified && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                ✓ Verificado
                              </span>
                            )}
                          </h4>
                          {review.title && (
                            <h5 className="font-semibold text-gray-800 mt-1">{review.title}</h5>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">({review.rating}/5)</span>
                      </div>
                      
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        {review.comment}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                          {review.packageName}
                        </span>
                        
                        {review.helpfulCount !== undefined && (
                          <button className="text-sm text-gray-500 hover:text-[#FFA62B] flex items-center gap-1">
                            👍 {review.helpfulCount} acharam útil
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Nenhuma avaliação encontrada.</p>
                <p className="text-gray-400 text-sm mt-2">Seja o primeiro a avaliar este pacote!</p>
              </div>
            )}
          </div>

          {/* Botão para adicionar avaliação */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              className="w-full bg-[#FFA62B] text-[#003194] font-bold py-3 text-lg rounded-lg shadow-lg hover:bg-[#e8941f] transition-all duration-200"
              onClick={() => {
                // TODO: Implementar modal de nova avaliação
                console.log('Abrir modal de nova avaliação');
              }}
            >
              Escrever uma avaliação
            </Button>
          </div>
        </>
      )}
    </div>
  </div>
)}

      </div>
      <Footer />
    </div>
  );
}

export default Package;