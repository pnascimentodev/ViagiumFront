import { useState, useEffect } from 'react';
import italyImg from '../../assets/img/italy.jpg';
import veneza3Img from '../../assets/img/veneza3.jpg';
import veneza4Img from '../../assets/img/veneza4.jpg';
import veneza1Img from '../../assets/img/veneza1.jpg';
import { Button } from '../../components/Button';
import { FaChevronLeft, FaChevronRight, FaRegCalendarAlt } from 'react-icons/fa';
import { IoPersonCircleOutline } from 'react-icons/io5';
import Footer from '../../components/Footer';

function Package() {

  const [currentPackageIndex] = useState(0);
  const [packageImageIndex, setPackageImageIndex] = useState(0);
  const [hotelImageIndex, setHotelImageIndex] = useState(0);
  const [roomTypeIndex, setRoomTypeIndex] = useState(0);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const openHotelModal = () => setShowHotelModal(true);
  const closeHotelModal = () => setShowHotelModal(false);

  const packageDetails = [
    {
      title: "Pacote Veneza Mágica – 5 dias de encanto!",
      description: "Explore os canais e a cultura de Veneza com este pacote que inclui passeios de gôndola, visitas a museus e muito mais.",
      images: [italyImg, veneza3Img, veneza4Img],
      passagem: [5524, 6000],
      hospedagem: [
        [1300, 1400, 1500], 
        [1200, 1250, 1350]
      ],
      encargos: [1200, 1300],
      duracoes: [
        "01/06/2025 - 05/06/2025",
        "10/07/2025 - 14/07/2025"
      ],
      hotelNames: [
        "Hotel Danieli",
        "Hotel Gritti Palace"
      ],
      hotelRatings: [4.8, 4.6],
      prices: [5600, 8700],
      hotelAddresses: [
        "Riva degli Schiavoni, 4196, 30122 Venezia VE, Itália",
        "Campo Santa Maria del Giglio, 2467, 30124 Venezia VE, Itália"
      ],
      roomTypes: [
        ["Standard - até 2 hóspedes", "Deluxe - até 3 hóspedes", "Suite - até 4 hóspedes"],
        ["Standard - até 2 hóspedes", "Deluxe - até 3 hóspedes", "Suite - até 4 hóspedes"]
      ],
      roomIncludes: [
        [
          "Café da manhã incluso",
          "Vista para o canal",
          "Wi-Fi grátis"
        ],
        [
          "Café da manhã incluso",
          "Piscina",
          "Frigobar"
        ]
      ],
    },
    
  ];

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

  const prevPackageImage = () => {
    setPackageImageIndex((prev) =>
      prev === 0 ? pacoteImages.length - 1 : prev - 1
    );
  };
  const nextPackageImage = () => {
    setPackageImageIndex((prev) =>
      prev === pacoteImages.length - 1 ? 0 : prev + 1
    );
  };

  const passagem = currentPackage.passagem[hotelImageIndex];
  const hospedagem = currentPackage.hospedagem[hotelImageIndex][roomTypeIndex];
  const encargos = currentPackage.encargos[hotelImageIndex];
  const valorTotal = passagem + hospedagem + encargos;

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-r h-full from-[#003194] to-[#FFA62B] flex justify-center items-center">
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
            <button
              onClick={nextPackageImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={prevPackageImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {pacoteImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === packageImageIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
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
                      <h2 className="font-medium">Duração</h2>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <FaRegCalendarAlt className=" text-xl" />
                      <select className="w-full border rounded px-2 py-1">
                        {currentPackage.duracoes.map((duracao, idx) => (
                          <option key={idx}>{duracao}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="font-medium">Número de pessoas</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                      <IoPersonCircleOutline className="text-2xl" />
                      <select className="w-full border rounded px-2 py-1">
                        <option>1 pessoa</option>
                        <option>2 pessoas</option>
                        <option>3 pessoas</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FFFFFF] rounded-lg shadow-md mt-7 transition duration-300 hover:scale-105">
                  <div className="flex p-4">
                    <h3 className="text-lg font-semibold">Resumo</h3>
                  </div>
                  <div className="flex not-last-of-type:pl-4">
                    <h3 className="text-lg font-semibold text-[#FFA62B]">Valor por pessoa</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between text-sm">
                      <span>Passagens:</span>
                      <span className="font-semibold">{`R$ ${passagem.toLocaleString('pt-BR')},00`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Hospedagem:</span>
                      <span className="font-semibold">{`R$ ${hospedagem.toLocaleString('pt-BR')},00`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Impostos e encargos:</span>
                      <span className="font-semibold">{`R$ ${encargos.toLocaleString('pt-BR')},00`}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Valor total</span>
                      <span>{`R$ ${valorTotal.toLocaleString('pt-BR')},00`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column - Hotel and Room */}
            <div className="rounded-xl p-2">
              <div className="space-y-6">
                {/* Hotel Section */}
                <div className="transition duration-300 hover:scale-105 bg-[#FFFFFF] rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-4">Hotel</h3>
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
                        className="text-sm px-4 py-2 rounded shadow bg-[#FFA62B] text-[#003194] font-bold hover:scale-105 transition-all duration-200"
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
                            className="w-full text-white font-bold py-4 text-lg rounded-2xl shadow-lg hover:scale-105 transition-all duration-200" style={{ backgroundColor: '#FFA62B', color: '#003194'}}
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
                          {currentPackage.roomIncludes[hotelImageIndex].map((item, idx) => (
                            <li key={idx} className="text-gray-600 text-xs">{item}</li>
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
                className="w-full text-white font-bold py-4 text-lg rounded-2xl shadow-lg hover:scale-105 transition-all duration-200" 
              >
                Reservar Agora
              </Button>
            </div>
          </div>
        </div>

        {showHotelModal && (
          <div className="fixed inset-0 flex justify-center items-center z-[99999]" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-lg p-6 max-w-xl w-full relative z-[100000]">
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
                {currentPackage.roomIncludes[hotelImageIndex].map((item, idx) => (
                  <li key={idx} className="text-xl">{item}</li>
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
                className="w-full text-font-bold py-4 text-lg rounded-2xl shadow-lg hover:scale-105 transition-all duration-200" style={{ backgroundColor: '#FFA62B', color: '#003194'}}
              >
                  Ver no mapa
              </Button>
            </div>
            </div>
          </div>
        )}
        
      <Footer />
      </div>
  );
}

export default Package;