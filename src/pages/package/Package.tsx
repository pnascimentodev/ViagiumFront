import { useState, useEffect } from 'react';
import italyImg from '../../assets/img/italy.jpg';
import veneza1Img from '../../assets/img/veneza1.jpg';
import { Button } from '../../components/Button';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoPersonCircleOutline } from 'react-icons/io5';
import Footer from '../../components/Footer';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useNavigate } from "react-router-dom";

function Package() {

      interface PackageDetails {
      id: number;
      title: string;
      description: string;
      originAddressId: number;
      destinationAddressId: number;
      imageUrl: string;
      duration: number;
      maxPeople: number;
      vehicleType: string;
      originalPrice: number;
      price: number;
      packageTax: number;
      cupomDiscount: string;
      discountValue: number;
      schedules: {
        startDate: string;
        endDate?: string;
        isFixed: boolean;
        isAvailable: boolean;
      }[];
    }

  const navigate = useNavigate();
  const [numPessoas, setNumPessoas] = useState(1);
  const [currentPackageIndex] = useState(0);
  const [cupomDiscountInput, setCupomDiscountInput] = useState('');
  const [packageImageIndex, setPackageImageIndex] = useState(0);
  const [roomIncludes, setRoomIncludes] = useState<{ amenityId: number; name: string; iconName: string }[]>([]);
  const [roomTypeAmenities, setRoomTypeAmenities] = useState<{ amenityId: number; name: string; iconName: string }[]>([]);
  const [hotelImageIndex, setHotelImageIndex] = useState(0);
  const [roomTypeIndex, setRoomTypeIndex] = useState(0);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showAvaliacoesModal, setShowAvaliacoesModal] = useState(false);
  const openHotelModal = () => setShowHotelModal(true);
  const closeHotelModal = () => setShowHotelModal(false);
  const openAvaliacoesModal = () => setShowAvaliacoesModal(true);
  const closeAvaliacoesModal = () => setShowAvaliacoesModal(false);


    useEffect(() => {
    axios.get(`http://localhost:5028/api/Amenity/Hotel`)
      .then(res => { 
      setRoomIncludes(res.data);
    })
      .catch(() => setRoomIncludes([]));
  }, [hotelImageIndex]);

  useEffect(() => {
  if (showHotelModal) {
    axios.get('http://localhost:5028/api/Amenity/TypeRoom')
      .then(res => setRoomTypeAmenities(res.data))
      .catch(() => setRoomTypeAmenities([]));
  }
}, [showHotelModal, roomTypeIndex]);

  const [packageDetails] = useState([
    {
      title: "Pacote Veneza Mágica – 5 dias de encanto!",
      description: "Explore os canais e a cultura de Veneza com este pacote que inclui passeios de gôndola, visitas a museus e muito mais.",
      images: [italyImg],
      originAddress: {city:"Recife", country: 'Brasil'},
      destinationAddress: {city:"Veneza", country: 'Itália'},
      vehicleType: "Avião",
      originalPrice: [5524, 6000],
      price: [5504, 4000],
      packageTax: [1300, 1300],
      cupomDiscount: ["Avanade10%", "Veneza20"],
      discountValue: [550, 800],
      duration: [
        "01/06/2025 - 05/06/2025",
        "10/07/2025 - 14/07/2025"
      ],
      hotelNames: [
        "Hotel Danieli",
        "Hotel Gritti Palace"
      ],
      hotelRatings: [4.8, 4.6],
      hotelAddresses: [
        "Riva degli Schiavoni, 4196, 30122 Venezia VE, Itália",
        "Campo Santa Maria del Giglio, 2467, 30124 Venezia VE, Itália"
      ],
      roomTypes: [
        ["Standard - até 2 hóspedes", "Deluxe - até 3 hóspedes", "Suite - até 4 hóspedes"],
        ["Standard - até 2 hóspedes", "Deluxe - até 3 hóspedes", "Suite - até 4 hóspedes"]
      ],
    },
  ]);

  useEffect(() => {
    setPackageImageIndex(0);
    setHotelImageIndex(0);
    setRoomTypeIndex(0);
  }, [currentPackageIndex]);

  useEffect(() => {
    setRoomTypeIndex(0);
  }, [hotelImageIndex]);

  const currentPackage = packageDetails[currentPackageIndex];
  const pacoteImages = currentPackage.images;
  const price = currentPackage.price[hotelImageIndex] * numPessoas;
  const originalPrice = currentPackage.originalPrice[hotelImageIndex] * numPessoas;
  const packageTax = currentPackage.packageTax[hotelImageIndex];
  const cupomDiscount = currentPackage.cupomDiscount[hotelImageIndex];
  const discountValue = currentPackage.discountValue[hotelImageIndex];
  const valorFinal = (price + packageTax) - discountValue;

  return (
    <div>
        <Navbar />
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
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
                      <span className="font-semibold ">Origem:&nbsp;</span>{currentPackage.originAddress.city}, {currentPackage.originAddress.country}
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold ">Destino:&nbsp;</span>{currentPackage.destinationAddress.city}, {currentPackage.destinationAddress.country}
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="font-semibold">Duração</h2>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <FaRegCalendarAlt className=" text-xl" />
                      <select className="w-full border rounded px-2 py-1">
                        {currentPackage.duration.map((duracao, idx) => (
                          <option key={idx}>{duracao}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="font-semibold">Número de pessoas</h2>
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
                      {currentPackage.hotelNames.map((hotel, index) => (
                        <option key={index} value={index}>{hotel}</option>
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
                        <h4 className="font-semibold">{currentPackage.hotelNames[hotelImageIndex]}</h4>
                        <div className="flex items-center space-x-1 mb-1">
                          <svg className="w-5 h-5 inline" fill="#FFA62B" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                          </svg>
                          <span className="text-sm font-medium">{currentPackage.hotelRatings[hotelImageIndex]}</span>
                        </div>
                        {/* Imagem do hotel */}
                        <div className="relative rounded-lg overflow-hidden mb-6">
                          <img
                            src={veneza1Img}
                            alt="Imagem do hotel"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                        {/* Endereço */}
                        <p className="text-sm text-gray-600 text-center mb-2">
                          {currentPackage.hotelAddresses[hotelImageIndex]}
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
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={roomTypeIndex}
                        onChange={e => setRoomTypeIndex(Number(e.target.value))}
                      >
                        {currentPackage.roomTypes[hotelImageIndex].map((tipo, idx) => (
                          <option key={idx} value={idx}>{tipo}</option>
                        ))}
                      </select>
                      <div className="justify-center mt-2">
                        <ul className="space-y-1">
                          {roomIncludes.map((item) => (
                            <li key={item.amenityId} className="text-gray-600 text-xs">{item.name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
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

        {showHotelModal && (
          <div className="fixed inset-0 flex justify-center items-center z-[99999]" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-lg p-6 max-w-xl w-full relative z-[100000]" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <button
                className="absolute top-2 right-2 text-gray-500 text-xl z-[100001]"
                onClick={closeHotelModal}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-2">{currentPackage.hotelNames[hotelImageIndex]}</h2>
              <img
                src={veneza1Img}
                alt="Imagem do hotel"
                className="w-full h-48 object-cover rounded mb-4"
              />
              <p className="mb-2 text-xl">{currentPackage.hotelAddresses[hotelImageIndex]}</p>
                <ul className="mb-2">
                  {roomTypeAmenities.map((item) => (
                    <li key={item.amenityId} className="text-gray-600 text-xs">{item.name}</li>
                  ))}
                </ul>
                <span className="flex items-center font-semibold text-xl">
                  Avaliação:&nbsp;
                  <svg className="w-5 h-5 mr-1" fill="#FFA62B" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                  </svg>
                  <span className="font-medium">{currentPackage.hotelRatings[hotelImageIndex]}</span>
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
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <button
            className="absolute top-4 right-4 text-gray-500 text-2xl font-bold"
            onClick={closeAvaliacoesModal}
            aria-label="Fechar"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-center mb-8 ">Avaliações do Pacote de Viagem</h2>
      {/* Nota geral */}
      <div className="bg-[#F8FAFC] rounded-lg shadow p-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, idx) => (
              <svg key={idx} className="w-5 h-5" fill={idx < 4 ? "#FFA62B" : "#E5E7EB"} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
              </svg>
            ))}
          </div>
          <span className="text-gray-500 ml-2">5 estrelas</span>
        </div>
        <span className="text-gray-500 text-sm">Baseado em 4 avaliações</span>
        {/* Barras de avaliação */}
        <div className="mt-4 space-y-1">
          {[5,4,3,2,1].map(star => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs font-bold w-4">{star}★</span>
              <div className="bg-gray-200 rounded h-2 w-32">
                <div
                  className={`bg-[#FFA62B] h-2 rounded`}
                  style={{ width: star === 5 ? "50%" : star === 4 ? "50%" : "0%" }}
                />
              </div>
              <span className="text-xs text-gray-500">{star === 5 || star === 4 ? 2 : 0}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Lista de avaliações */}
      <div className="space-y-4">
        {/* Avaliação 1 */}
        <div className="bg-[#F8FAFC] rounded-lg shadow p-4 flex gap-4 items-start mb-4">
          <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold"></div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#003194]">Maria Silva</span>
              <span className="text-xs text-gray-500">15 de Janeiro, 2024</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, idx) => (
                <svg key={idx} className="w-4 h-4" fill="#FFA62B" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">(5/5)</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Experiência incrível! O pacote superou todas as expectativas. Os hotéis eram excelentes e os passeios muito bem organizados. Recomendo para todos!
            </p>
            <span className="bg-[#E5E7EB] text-xs px-2 py-1 rounded">Pacote Europa Clássica - 15 dias</span>
          </div>
        </div>
        {/* Avaliação 2 */}
        <div className="bg-[#F8FAFC] rounded-lg shadow p-4 flex gap-4 items-start mb-4">
          <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">J</div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#003194]">João Santos</span>
              <span className="text-xs text-gray-500">8 de Janeiro, 2024</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(4)].map((_, idx) => (
                <svg key={idx} className="w-4 h-4" fill="#FFA62B" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                </svg>
              ))}
              <svg className="w-4 h-4" fill="#E5E7EB" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
              </svg>
              <span className="text-xs text-gray-500 ml-1">(4/5)</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Muito bom! Apenas alguns pequenos atrasos nos voos, mas no geral foi uma viagem fantástica. A equipe de suporte foi muito prestativa.
            </p>
            <span className="bg-[#E5E7EB] text-xs px-2 py-1 rounded">Pacote Europa Clássica - 15 dias</span>
          </div>
        </div>
        {/* Avaliação 3 */}
        <div className="bg-[#F8FAFC] rounded-lg shadow p-4 flex gap-4 items-start mb-4">
          <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">A</div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#003194]">Ana Costa</span>
              <span className="text-xs text-gray-500">2 de Janeiro, 2024</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, idx) => (
                <svg key={idx} className="w-4 h-4" fill="#FFA62B" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">(5/5)</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Perfeito do início ao fim! Cada detalhe foi cuidadosamente planejado. As cidades visitadas eram deslumbrantes e os guias muito conhecedores.
            </p>
            <span className="bg-[#E5E7EB] text-xs px-2 py-1 rounded">Pacote Europa Clássica - 15 dias</span>
          </div>
        </div>
          {/* Avaliação 4 */}
          <div className="bg-[#F8FAFC] rounded-lg shadow p-4 flex gap-4 items-start mb-4">
            <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">C</div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#003194]">Carlos Oliveira</span>
                <span className="text-xs text-gray-500">28 de Dezembro, 2023</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(4)].map((_, idx) => (
                  <svg key={idx} className="w-4 h-4" fill="#FFA62B" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                  </svg>
                ))}
                <svg className="w-4 h-4" fill="#E5E7EB" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                </svg>
                <span className="text-xs text-gray-500 ml-1">(4/5)</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Boa experiência geral. Os hotéis eram confortáveis e as refeições deliciosas. Apenas senti falta de mais tempo livre para explorar por conta própria.
              </p>
              <span className="bg-[#E5E7EB] text-xs px-2 py-1 rounded">Pacote Europa Clássica - 15 dias</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
      <Footer />
      </div>
  );
}

export default Package;