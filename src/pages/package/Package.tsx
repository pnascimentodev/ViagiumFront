import { useState } from 'react';
import italyImg from '../../assets/img/italy.jpg';
import spainImg from '../../assets/img/spain.jpg';
import veneza1Img from '../../assets/img/veneza1.jpg';
import veneza2Img from '../../assets/img/veneza2.jpg';
import fernandodenoronhaImg from '../../assets/img/fernandodenoronha.jpg';
import { Button } from '../../components/Button';
import { FaChevronLeft, FaChevronRight, FaRegCalendarAlt } from 'react-icons/fa';
import { IoPersonCircleOutline } from 'react-icons/io5';
import Footer from '../../components/Footer';

function Package() {
  const images = [italyImg, spainImg, fernandodenoronhaImg];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hotelImages = [veneza1Img, veneza2Img];
  const [hotelImageIndex, setHotelImageIndex] = useState(0);

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Carrossel do hotel
  const prevHotelImage = () => {
    setHotelImageIndex((prev) =>
      prev === 0 ? hotelImages.length - 1 : prev - 1
    );
  };
  const nextHotelImage = () => {
    setHotelImageIndex((prev) =>
      prev === hotelImages.length - 1 ? 0 : prev + 1
    );
  };

  const packageDetails = [
    {
      title: "Pacote Espanha dos Sonhos – 7 dias inesquecíveis!",
      description: "Descubra o charme inigualável de Madrid com este pacote completo que reúne romance, cultura, gastronomia e história em um só destino. Ideal para casais, aventureiros solo ou amantes da arte e da arquitetura, esta viagem oferece uma imersão única na capital espanhola.",
      price: 4999
    },
    {
      title: "Pacote Itália Encantada – 10 dias de história e sabores!",
      description: "Explore Roma, Florença e Veneza em uma viagem inesquecível pela Itália, com passeios guiados e experiências gastronômicas.",
      price: 6999
    },
    {
      title: "Pacote Noronha – 5 dias de paraíso!",
      description: "Aproveite as praias e trilhas de Fernando de Noronha com todo o conforto e aventura.",
      price: 3999
    }
  ];

  const currentPackage = packageDetails[currentImageIndex];

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-r h-full from-[#003194] to-[#FFA62B] flex justify-center items-center">
      <div className="max-w-2xl w-full bg-white mt-20 mb-20 rounded-xl shadow-2xl p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {currentPackage.title}
        </h1>
        {/* Carrossel de Imagens */}
        <div className="relative rounded-lg overflow-hidden mb-6">
          <img
            src={images[currentImageIndex]}
            alt="Imagem do destino"
            className="w-full h-64 object-cover"
          />
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
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
                      <option>20/07/2025 - 27/07/2025</option>
                      <option>15/08/2025 - 22/08/2025</option>
                      <option>10/09/2025 - 17/09/2025</option>
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
                    <span>Viagem por pessoa:</span>
                    <span className="font-semibold">R$ 5.524,00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Transporte:</span>
                    <span className="font-semibold">R$ 1.567,00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Acomodação:</span>
                    <span className="font-semibold">R$ 1.567,00</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Valor total</span>
                    <span>R$ 9.826,00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Hotel and Room */}
          <div className="space-y-6">
            {/* Hotel Section */}
            <div className="transition duration-300 hover:scale-105 bg-[#FFFFFF] rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Hotel</h3>
              <div className="space-y-4">
                <select className="w-full border rounded px-2 py-1">
                  <option>Hotel Posta</option>
                  <option>Palazzo Artemide</option>
                  <option>Villa Fisher</option>
                </select>
                <div className="rounded-xl p-2">
                  <div className="flex flex-col items-center">
                    <h4 className="font-semibold">Hotel De L'Aqueduc</h4>
                    <div className="flex items-center space-x-1 mb-1">
                      <svg className="w-5 h-5 inline" fill="#FFA62B" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                      </svg>
                      <span className="text-sm font-medium">4.1</span>
                    </div>        
                    {/* Imagem */}
                        <div className="relative rounded-lg overflow-hidden mb-6">
                          <img
                            src={hotelImages[hotelImageIndex]}
                            alt="Imagem do hotel"
                            className="w-full h-64 object-cover"
                          />
                          <button
                            onClick={nextHotelImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                          >
                            <FaChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={prevHotelImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                          >
                            <FaChevronLeft className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {hotelImages.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === hotelImageIndex ? "bg-white" : "bg-white/50"}`}
                              />
                            ))}
                          </div>
                        </div>
                    {/* Endereço */}
                    <p className="text-sm text-gray-600 text-center mb-2">
                      10 Rue Philippe de Girard, 75010 Paris, França
                    </p>
                    {/* Informações do hotel */}
                    <a
                      href="https://goo.gl/maps/xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-0 h-auto text-sm underline mb-4"
                    >
                      Ver no mapa
                    </a>
                  </div>
                </div>
              </div>
                  {/* Quarto */}
                  <h3 className="text-lg font-semibold mb-2">Quarto</h3>
                  <div className="space-y-3 w-full">
                    <select className="w-full border rounded px-2 py-1">
                      <option>Standard - até 2 hóspedes</option>
                      <option>Deluxe - até 3 hóspedes</option>
                      <option>Suite - até 4 hóspedes</option>
                    </select>
                    <div className="justify-center mt-2">
                      <ul className="space-y-1">
                        <li className="text-gray-600 text-xs">Café da manhã incluso</li>
                        <li className="text-gray-600 text-xs">Vista para o mar</li>
                        <li className="text-gray-600 text-xs">Frigobar</li>
                      </ul>
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
    <Footer />
  </div>
  );
}

export default Package;