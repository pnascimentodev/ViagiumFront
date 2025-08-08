import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoPersonCircleOutline } from 'react-icons/io5';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useNavigate, useParams } from "react-router-dom";
import Footer from '../../components/Footer';


function Package() {

  interface TravelPackage { //A interface typescript serve para definir a estrutura dos dados que serão recebidos da API.
    id: number;
    travelPackageId?: number; 
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
    duration: number;
    startDate: string;
    isFixed?: boolean;
    isAvailable?: boolean;
    imageUrl?: string;
    images?: string;
    hotels?: Hotel[]; // Hotéis podem vir junto com o pacote
    cupomDiscount?: string; // Nome do cupom, se houver
  }

  interface Hotel {
    id?: number;
    hotelId?: number;
    name: string;
    address: any; // pode ser string ou objeto
    star: number; // Campo correto do backend
    imageUrl?: string;
    roomTypes: RoomType[];
    amenities?: Amenity[]; // amenities do hotel
  }

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
    packageId: number;
    packageName: string;
    rating: number;
    title?: string;
    description: string;
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

    const navigate = useNavigate();//função (navigate) usada para redirecionar o usuário para outra rota, seja após uma ação (como clicar em um botão, finalizar um cadastro, aplicar um filtro, etc.) ou automaticamente após algum evento, useNavigate serve para mudar de página/rota via código, não apenas por links É muito útil para fluxos de checkout, login, pós-formulário, etc. Permite também passar dados para a próxima página usando o parâmetro state
    const { packageId } = useParams<{ packageId: string }>(); //No React Router (v6+), o hook useParams sempre retorna os parâmetros da URL como string (ou undefined), porque tudo que vem da URL é texto. Mesmo que o valor represente um número (como um ID), ele chega como string. Aqui, você está dizendo ao TypeScript que espera que packageId seja uma string, o que está correto para o que o React Router retorna.
    const [numPessoas, setNumPessoas] = useState(1);
    const [cupomDiscountInput, setCupomDiscountInput] = useState('');
    const [hotelIndex, setHotelIndex] = useState(0);
    const [roomTypeIndex, setRoomTypeIndex] = useState(0);
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [showAvaliacoesModal, setShowAvaliacoesModal] = useState(false);
    const [currentPackage, setCurrentPackage] = useState<TravelPackage | null>(null);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const openHotelModal = () => setShowHotelModal(true);
    const closeHotelModal = () => setShowHotelModal(false);
    // const openAvaliacoesModal = () => setShowAvaliacoesModal(true);
    const closeAvaliacoesModal = () => setShowAvaliacoesModal(false);
      // Função utilitária para formatar endereço do hotel
   const renderHotelAddress = (address: any) => {
    if (!address) return 'Endereço não disponível';
    if (typeof address === 'string') return address;
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

  //No front-end moderno (especialmente em React), é convenção usar o prefixo fetch no nome de funções que buscam dados de uma API.
  const fetchTravelPackage = async (packageId: number) => {
  setLoading(true);
  setError('');
  
  try {
    const response = await axios.get(`https://viagium.azurewebsites.net/api/TravelPackage/getById/${packageId}`, {
      headers: {
        'accept': '*/*'
      }
    });
    
    console.log('resposta da API do pacote:', response.data);
    
    if (response.data) {
      setCurrentPackage(response.data);
      
      // Se o pacote incluir hotéis, configure-os
      if (response.data.hotels && response.data.hotels.length > 0) {
        setHotels(response.data.hotels);
        console.log('Hotéis carregados do pacote:', response.data.hotels.length);
      } else {
        setHotels([]); // Limpa hotéis se não houver
      }
      
      console.log('Pacote carregado com sucesso:', response.data.title);
    }
  } catch (error: unknown) {
    console.error('Erro ao buscar pacote:', error);
    if (axios.isAxiosError(error)) {
    }
    setError('Erro ao carregar dados do pacote. Verifique se a API está rodando.');
  } finally {
    setLoading(false);
  }
};

  // useEffect para carregar dados quando o componente monta
    useEffect(() => {
    const id = packageId ? parseInt(packageId) : 1;
    fetchTravelPackage(id);
  }, [packageId]);

  useEffect(() => {
    setHotelIndex(0);
    setRoomTypeIndex(0);
  }, [currentPackage]);

  useEffect(() => {
    setRoomTypeIndex(0);
  }, [hotelIndex]);

  // Calcular valores baseados nos dados da API


  const price = currentPackage ? currentPackage.price * numPessoas : 0;
  const packageTax = currentPackage ? currentPackage.packageTax : 0;
  const discountPercent = currentPackage ? currentPackage.discountValue : 0; 
  const [cupomError, setCupomError] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const pricePerNight = hotels[hotelIndex]?.roomTypes?.[roomTypeIndex]?.pricePerNight || 0;
  const durationNights = currentPackage ? (typeof currentPackage.duration === 'string' ? parseInt(currentPackage.duration) : Number(currentPackage.duration)) : 0;

  // CORREÇÃO: hospedagem = preço da acomodação x (duração - 1) x pessoas
  const acomodationTotal = pricePerNight * (durationNights > 1 ? durationNights - 1 : 0) * numPessoas;
  const valorBase = price + packageTax + acomodationTotal;
  const valorDesconto = cupomAplicado && discountPercent > 0 ? (valorBase * (discountPercent / 100)) : 0;
  const valorFinal = valorBase - valorDesconto;

  // Lógica para data de retorno (apenas para exibição)
  let returnDate: string | null = null;
  if (currentPackage?.startDate && durationNights > 0) {
    const start = new Date(currentPackage.startDate);
    start.setDate(start.getDate() + durationNights - 1); // -1 para considerar ida+volta no mesmo dia
    returnDate = start.toISOString();
  }

  // Nova lógica de cupom
  const aplicarCupom = async () => {
    setCupomError('');
    const input = cupomDiscountInput.trim();
    setCupomAplicado(false);
    if (!input) {
      return;
    }
    if (!currentPackage?.cupomDiscount) {
      setCupomError('Este pacote não possui cupom de desconto.');
      return;
    }
    if (input.toLowerCase() !== currentPackage.cupomDiscount.trim().toLowerCase()) {
      setCupomError('Cupom inválido.');
      return;
    }
    try {
      const response = await axios.get('https://viagium.azurewebsites.net/api/TravelPackage/cupom-discount', {
        params: { travelPackageId: currentPackage.travelPackageId ?? currentPackage.id, cupom: input }
      });
      setCupomAplicado(true);
      setCupomError('');
      console.log('Cupom aplicado com sucesso:', response.data);
    } catch (error) {
      setCupomAplicado(false);
      setCupomError('Erro ao validar cupom.');
    }
  };

  const getCurrentHotelAmenities = () => {
    if (!hotels[hotelIndex]) return [];
    const hotelAmenitiesArr = Array.isArray(hotels[hotelIndex].amenities) ? hotels[hotelIndex].amenities : [];
    return hotelAmenitiesArr;
  };

  // Função para obter amenities do tipo de quarto atual diretamente do objeto roomType
  const getCurrentRoomTypeAmenities = () => {
    if (hotels[hotelIndex]?.roomTypes?.[roomTypeIndex]?.amenities) {
      return hotels[hotelIndex].roomTypes[roomTypeIndex].amenities;
    }
    return [];
  };
  // Não é mais necessário buscar detalhes do tipo de quarto ao trocar o quarto selecionado

    useEffect(() => {
    setRoomTypeIndex(0);
  }, [numPessoas, hotelIndex]);

    // Adicione esses estados no componente Package
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      userId: 1,
      userName: "Maria Silva",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 5,
      title: "Experiência incrível!",
      description: "O pacote superou todas as expectativas. Os hotéis eram excelentes e os passeios muito bem organizados. Recomendo para todos!",
      createdAt: "2024-01-15T10:30:00Z",
      isVerified: true,
      helpfulCount: 12
    },
    {
      id: 2,
      userId: 2,
      userName: "João Santos",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 4,
      title: "Muito bom!",
      description: "Apenas alguns pequenos atrasos nos voos, mas no geral foi uma viagem fantástica. A equipe de suporte foi muito prestativa.",
      createdAt: "2024-01-08T14:22:00Z",
      isVerified: true,
      helpfulCount: 8
    },
    {
      id: 3,
      userId: 3,
      userName: "Ana Costa",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 5,
      title: "Perfeito!",
      description: "Perfeito do início ao fim! Cada detalhe foi cuidadosamente planejado. As cidades visitadas eram deslumbrantes e os guias muito conhecedores.",
      createdAt: "2024-01-02T09:15:00Z",
      isVerified: true,
      helpfulCount: 15
    },
    {
      id: 4,
      userId: 4,
      userName: "Carlos Oliveira",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 4,
      title: "Boa experiência",
      description: "Boa experiência geral. Os hotéis eram confortáveis e as refeições deliciosas. Apenas senti falta de mais tempo livre para explorar por conta própria.",
      createdAt: "2023-12-28T16:45:00Z",
      isVerified: true,
      helpfulCount: 6
    },
    {
      id: 5,
      userId: 5,
      userName: "Fernanda Lima",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 5,
      title: "Simplesmente mágico!",
      description: "Veneza é realmente mágica! O passeio de gôndola foi inesquecível. A organização do pacote foi impecável e todos os detalhes foram cuidados.",
      createdAt: "2024-01-20T11:15:00Z",
      isVerified: true,
      helpfulCount: 9
    },
    {
      id: 6,
      userId: 6,
      userName: "Roberto Mendes",
      packageId: 1,
      packageName: "Pacote Veneza Mágica",
      rating: 4,
      title: "Muito satisfeito",
      description: "Excelente custo-benefício. Os hotéis tinham boa localização e o atendimento foi sempre cordial. Voltaria a viajar com esta empresa.",
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

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, idx) => {
        const filled = idx < rating;
        return (
          <svg 
            key={idx} 
            className={sizeClasses[size]} 
            fill={filled ? "#FFA62B" : "#E5E7EB"} 
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
          </svg>
        );
      })}
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
          <div className="relative rounded-lg overflow-hidden mb-6">
            <img
              src={currentPackage.imageUrl}
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
                    <div className="flex items-center space-x-3 mb-2 gap-2">
                      <span className="font-semibold">Duração:</span>
                      <div className="w-full rounded px-2 py-1 flex items-center">
                        <FaRegCalendarAlt className="text-xl mr-2" />
                        <span>{currentPackage.duration} dias</span>
                      </div>
                    </div>
                        <div className="flex items-center mb-2 gap-1 flex-wrap">
                            <span className="font-semibold">Data de Início:</span>
                            <span>{currentPackage.startDate
                              ? formatDate(currentPackage.startDate)
                              : 'Não informado'}</span>
                        </div>
                        <div className="flex items-center mb-2 gap-1 flex-wrap">
                            <span className="font-semibold">Data de Retorno:</span>
                            <span>{returnDate ? formatDate(returnDate) : 'Não informado'}</span>
                        </div>
                          {/*
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-semibold ">Data de Término:&nbsp;</span>
                            {currentPackage.packageSchedule?.endDate
                              ? formatDate(currentPackage.packageSchedule.endDate)
                              : 'Não informado'}
                          </div>
                          */}
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
                        {(() => {
                          const max = hotels[hotelIndex]?.roomTypes?.[roomTypeIndex]?.maxOccupancy || 4;
                          return Array.from({ length: max }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1} pessoa{i === 0 ? '' : 's'}</option>
                          ));
                        })()}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FFFFFF] rounded-lg shadow-md mt-7 transition duration-300 hover:scale-105">
                  <div className="flex ml-4 mt-4">
                    <h3 className="text-lg font-semibold">Resumo</h3>
                  </div>
                  <div className="p-4">
                    {/* Exibe campo de cupom sempre */}
                    <div className="flex items-center space-x-3 mb-2">
                      <label htmlFor="cupom" className="font-semibold">Cupom de desconto</label>
                      <input
                        id="cupom"
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={cupomDiscountInput}
                        onChange={e => {
                          setCupomDiscountInput(e.target.value);
                          setCupomAplicado(false); // Remove desconto se campo for alterado
                        }}
                      />
                      {cupomError && <span className="text-red-500">{cupomError}</span>}
                    </div>
                    <div className="flex justify-end mb-2">
                      <Button
                        className="font-bold px-4 py-2 rounded shadow hover:scale-105 transition-all duration-200"
                        onClick={aplicarCupom}
                        type="button"
                      >
                        Aplicar cupom
                      </Button>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">Pacote + Transporte:</span>
                      <span className="font-bold">{`R$ ${price.toLocaleString('pt-BR')},00`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">Hospedagem:</span>
                      <span className="font-bold">{`R$ ${acomodationTotal.toLocaleString('pt-BR')},00`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">Impostos e encargos:</span>
                      <span className="font-bold">{`R$ ${packageTax.toLocaleString('pt-BR')},00`}</span>
                    </div>
                      <div className="flex justify-between text-sm text-green-700">
                        <span className="font-bold">Desconto do cupom:</span>
                        <span className="font-bold">- R$ {valorDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Valor Final</span>
                      <span>{`R$ ${valorFinal.toLocaleString('pt-BR')},00`}</span>
                    </div>
                  </div>
                </div>
                {/* <div className="bg-[#FFFFFF] rounded-lg shadow-md mt-7 transition duration-300 hover:scale-105 p-4">
                    <h3 className='font-bold mb-4 text-lg'>Avaliações do pacote</h3>
                      <Button
                        className="text-sm  px-4 py-2 rounded shadow font-bold hover:scale-101 transition-all duration-200 mb-4 "
                        onClick={openAvaliacoesModal}
                      >
                        Ver avaliações
                      </Button>
                </div>  */}
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
                      value={hotelIndex}
                      onChange={e => setHotelIndex(Number(e.target.value))}
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
                        <h4 className="font-semibold">{hotels[hotelIndex]?.name || 'Hotel não encontrado'}</h4>
                        {(hotels[hotelIndex]?.star || hotels[hotelIndex]?.star) && (
                          <div className="flex items-center space-x-1 mb-1">
                            {(() => {
                              const star = hotels[hotelIndex]?.star || hotels[hotelIndex]?.star || 0;
                              return renderStars(star, 'sm');
                            })()}
                          </div>
                        )}
                        {/* Imagem do hotel */}
                        <div className="relative rounded-lg overflow-hidden mb-6">
                          <img
                            src={hotels[hotelIndex]?.imageUrl || '/vite.svg'}
                            alt="Imagem do hotel"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                        {/* Endereço */}
                        <p className="text-sm text-gray-600 text-center mb-2">
                          {renderHotelAddress(hotels[hotelIndex]?.address)}
                        </p>
                        {/* Informações do hotel 
                        <div className="p-6 pt-8">
                          <Button
                            className="w-full text-white font-bold py-4 text-lg shadow-lg hover:scale-105 transition-all duration-200" 
                          >
                            Ver no mapa
                          </Button>
                          
                        </div>
                        */}
                      </div>
                    </div>
                    {/* Quarto */}
                    <h3 className="text-lg font-semibold mb-2">Quarto</h3>
                    <div className="space-y-3 w-full">
                        {Array.isArray(hotels[hotelIndex]?.roomTypes) && hotels[hotelIndex].roomTypes.length > 0 ? (
                          <>
                            <select
                              className="w-full border rounded px-2 py-1"
                              value={roomTypeIndex}
                              onChange={e => setRoomTypeIndex(Number(e.target.value))}
                            >
                              {hotels[hotelIndex].roomTypes.map((roomType, realIdx) => (
                                <option key={roomType.roomTypeId} value={realIdx}>{roomType.name} - até {roomType.maxOccupancy} hóspedes</option>
                              ))}
                            </select>
                            <div className="justify-center mt-2">
                              <h5 className="font-semibold mb-1">Adicionais:</h5>
                              <ul className="space-y-1">
                                {getCurrentRoomTypeAmenities().length > 0 ? (
                                  getCurrentRoomTypeAmenities().map((item) => (
                                    <li key={item.id ?? item.amenityId} className="text-gray-600 text-xs">{item.name}</li>
                                  ))
                                ) : (
                                  <li className="text-gray-400 text-xs">Nenhum adicional disponível para este quarto.</li>
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
          </div>
          <div className="p-6 pt-8">
                  <Button
                    onClick={() => {
                      const selectedHotel = hotels[hotelIndex];
                      const selectedHotelId = selectedHotel?.hotelId ?? selectedHotel?.id;
                      const roomTypeId = selectedHotel?.roomTypes?.[roomTypeIndex]?.roomTypeId ?? 0;
                      const travelPackageId = currentPackage?.travelPackageId ?? currentPackage?.id ?? 0;
                      const startDate = currentPackage?.startDate;
                      const userId = Number(localStorage.getItem("userId")) || 0;
                      const numPessoasReserva = numPessoas;

                      const navigationData = {
                        reservationData: {
                          travelPackageId,
                          hotelId: selectedHotelId,
                          roomTypeId,
                          startDate,
                          numPessoas: numPessoasReserva,
                          userId,
                          totalValue: valorFinal,
                          cupomApplied: cupomAplicado,
                          discountValue: cupomAplicado ? valorDesconto : 0,
                          returnDate // <-- data de retorno só para exibição
                        },
                        displayData: {
                          packageTitle: currentPackage?.title,
                          packageDescription: currentPackage?.description,
                          hotelName: selectedHotel?.name,
                          roomTypeName: selectedHotel?.roomTypes?.[roomTypeIndex]?.name,
                          packagePrice: price,
                          accommodationTotal: acomodationTotal,
                          packageTax: packageTax,
                          discountValue: cupomAplicado ? valorDesconto : 0,
                          finalValue: valorFinal,
                          duration: currentPackage?.duration,
                          numPessoas: numPessoas,
                          cupomApplied: cupomAplicado,
                          vehicleType: currentPackage?.vehicleType,
                          originCity: currentPackage?.originCity,
                          originCountry: currentPackage?.originCountry,
                          destinationCity: currentPackage?.destinationCity,
                          destinationCountry: currentPackage?.destinationCountry,
                          startDate,
                          returnDate // <-- data de retorno só para exibição
                        }
                      };

                      console.log('Dados sendo enviados para Reservation:', navigationData);

                      navigate("/reservation", {
                        state: navigationData
                      });
                    }}
                    className="w-full text-white font-bold py-4 text-lg rounded-2xl shadow-lg hover:scale-105 transition-all duration-200"
                    style={{ backgroundColor: '#FFA62B', color: '#003194' }}
                  >
                    Reservar Agora
                  </Button>
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
              <h2 className="text-xl font-bold mb-2">{hotels[hotelIndex]?.name || 'Hotel não encontrado'}</h2>
              <img
                src={hotels[hotelIndex]?.imageUrl}
                alt="Imagem do hotel"
                className="w-full h-48 object-cover rounded mb-4"
              />
               {(hotels[hotelIndex]?.star || hotels[hotelIndex]?.star) && (
                  <div className="flex items-center font-semibold text-xl mb-4">
                    <span className="mr-2">Nível do hotel:</span>
                    {renderStars(hotels[hotelIndex]?.star || hotels[hotelIndex]?.star || 0, 'md')}       
                  </div>
                )}
              <p className="mb-2 text-xl">{renderHotelAddress(hotels[hotelIndex]?.address)}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Adicionais do Hotel:</h4>
                  <ul className="mb-2">
                    {getCurrentHotelAmenities().map((item) => (
                      <li key={item.id} className="text-gray-600 text-xs">{item.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Adicionais do Quarto:</h4>
                  <ul className="mb-2">
                    {getCurrentRoomTypeAmenities().map((item) => (
                      <li key={item.id} className="text-gray-600 text-xs">{item.name}</li>
                    ))}
                  </ul>
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
              
              <h2 className="text-2xl font-bold text-center mb-8">
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
                          <span className="text-2xl font-bold">
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
                            <div className=" rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {review.userName.charAt(0)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <div>
                                  <h4 className="font-bold text-lg">
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
                                {review.description}
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
                      className="w-full bg-[#FFA62B] font-bold py-3 text-lg rounded-lg shadow-lg hover:bg-[#e8941f] transition-all duration-200"
                      onClick={() => {
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