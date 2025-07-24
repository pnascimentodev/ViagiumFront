import { Button } from "../../components/Button.tsx"
import logo from "../../assets/img/logo.svg"
import { FaUser, FaCalendarAlt, FaChartLine, FaPercentage, FaUsers, FaShieldAlt, FaBullhorn, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";

function AffiliatePage() {
  // Carrossel de imagens
  const hotels = [
    {
      name: "Hotel Paris Tower",
      image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    },
    {
      name: "Hotel Vista Mar",
      image: "https://images.pexels.com/photos/21014/pexels-photo.jpg",
    },
    {
      name: "Hotel Jardim Europa",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    },
    {
      name: "Hotel Central Palace",
      image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    },
    {
      name: "Hotel Lago Azul",
      image: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slides: {
      perView: 1.2,
      spacing: 6,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 1.5, spacing: 8 },
      },
      '(min-width: 768px)': {
        slides: { perView: 2.2, spacing: 10 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3.2, spacing: 12 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });
  return (
    <div className="bg-[#003194] flex flex-col gap-y-5">

      {/* Background image - Eiffel Tower */}
      <div className="bg-cover bg-center bg-no-repeat bg-[url('https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg')]">

        <div className="flex flex-col bg-gradient-to-b from-[#00319400] to-[#003194FF]">

          <header className="w-full px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Logo"
                  className="h-22 w-auto"
                />
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center ml-10">
                <div className="flex items-center text-white">
                  <a href="#"
                    className="mr-8 hover:text-orange-300 transition-colors duration-200 whitespace-nowrap font-medium underline">
                    Vantagens
                  </a>
                  <a href="#"
                    className="mr-8 hover:text-orange-300 transition-colors duration-200 whitespace-nowrap font-medium underline">
                    Nossos Parceiros
                  </a>
                  <a href="#"
                    className="mr-8 hover:text-orange-300 transition-colors duration-200 whitespace-nowrap font-medium underline">
                    Cadastre-se
                  </a>
                  <a href="#"
                    className="hover:text-orange-300 transition-colors duration-200 whitespace-nowrap font-medium underline">
                    Sobre Nós
                  </a>
                </div>
              </div>

              {/* Login Button */}
              <div className="flex-shrink-0 ml-auto mr-14">
                <Button className="!flex !items-center !text-white !bg-transparent !border-none !hover:bg-white/10 !transition-colors !duration-200 !font-medium !px-4 !py-2">
                  <FaUser className="w-4 h-4 mr-2 text-white fill-white stroke-white" />
                  Login
                </Button>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <div className="flex flex-col justify-center items-center text-center max-w-3xl mx-auto h-[50vh] p-5">
            <p className="text-md text-white md:text-2xl mb-2 ">
              Temos alta demanda de hospedagens. O que falta para <br />você anunciar a sua?
            </p>
            <h1 className="text-2xl text-white md:text-4xl font-bold tracking-wide">TORNE-SE UM AFILIADO</h1>
          </div>
        </div>
      </div>

      {/* Card vantagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full px-5 py-10 mx-auto">
        {/* Card 1 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-blue-500 mb-4">
            <FaCalendarAlt className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Acompanhe suas reservas em tempo real</h3>
          <p className="text-blue-900 text-sm leading-relaxed">
            Dashboard exclusivo com todas as reservas feitas no seu hotel
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-blue-500 mb-4">
            <FaChartLine className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Ganhos mensais garantidos</h3>
          <p className="text-blue-900 text-sm leading-relaxed">
            Receba comissões mensais pelas reservas feitas pelos clientes
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-blue-500 mb-4">
            <FaPercentage className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Alta lucratividade com baixa taxa</h3>
          <p className="text-blue-900 text-sm leading-relaxed">Apenas 10% sobre o valor da reserva</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-blue-500 mb-4">
            <FaUsers className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Cresça junto com a rede de parceiros</h3>
          <p className="text-blue-900 text-sm leading-relaxed">Expanda seus serviços e alcance mais viajantes</p>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-blue-500 mb-4">
            <FaShieldAlt className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Sem burocracia para cadastrar</h3>
          <p className="text-blue-900 text-sm leading-relaxed">Cadastre-se, compartilhe e venda. Simples assim!</p>
        </div>

        {/* Card 6 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-blue-500 mb-4">
            <FaBullhorn className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Divulgação ativa do seu hotel</h3>
          <p className="text-blue-900 text-sm leading-relaxed">
            Seu hotel ganha visibilidade na nossa rede e é promovido diretamente para viajantes
          </p>
        </div>
      </div>


      {/* Carrossel */}
      <div className="w-full flex flex-col items-center py-20 bg-[#002673]">

        <h2 className="text-5xl font-bold text-[#ffffff] mb-15">Nossos parceiros</h2>

        <div className="relative w-full max-w-6xl">

          <div ref={sliderRef} className="keen-slider rounded-lg overflow-visible">

            {hotels.map((hotel, idx) => (
              <div key={idx} className="keen-slider__slide flex items-center justify-center">
                <div className="bg-gray-100 rounded-xl shadow-md flex items-center justify-center w-[85%] h-90 md:h-90 mx-auto transition-transform duration-300 relative overflow-hidden">
                  <img src={hotel.image} alt={hotel.name} className="object-cover w-full h-full rounded-xl" />
                  <div className="absolute inset-0 flex items-center justify-center ">
                    <span className="text-white font-bold text-3xl px-8 py-2 rounded-lg text-center" style={{ textShadow: "2px 2px 8px #000" }}>{hotel.name}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Paginação (dots) sobre o carrossel */}
            <div className="absolute left-0 right-0 bottom-4 flex justify-center gap-2 z-20 pointer-events-none">
              {hotels.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`w-3 h-3 rounded-full transition border border-blue-700 ${currentSlide === idx ? 'bg-blue-700' : 'bg-white'} pointer-events-auto`}
                  aria-label={`Ir para o slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          {/* Botões de navegação */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-700 rounded-full p-2 shadow-md z-10 transition"
            aria-label="Anterior"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-700 rounded-full p-2 shadow-md z-10 transition"
            aria-label="Próximo"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Formulário de Afiliados */}
      <div className="w-full max-w-6xl mx-auto p-6 mt-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#003194] mb-8 text-left">Insira seus dados</h2>
          <form className="space-y-6">
            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-[#003194] mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Nome"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="sobrenome" className="block text-sm font-medium text-[#003194] mb-2">
                  Sobrenome
                </label>
                <input
                  type="text"
                  id="sobrenome"
                  name="sobrenome"
                  placeholder="Sobrenome"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="telefone1" className="block text-sm font-medium text-[#003194] mb-2">
                  Telefone 1
                </label>
                <input
                  type="tel"
                  id="telefone1"
                  name="telefone1"
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="telefone2" className="block text-sm font-medium text-[#003194] mb-2">
                  Telefone 2 (opcional)
                </label>
                <input
                  type="tel"
                  id="telefone2"
                  name="telefone2"
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#003194] mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="confirmarEmail" className="block text-sm font-medium text-[#003194] mb-2">
                  Confirmar e-mail
                </label>
                <input
                  type="email"
                  id="confirmarEmail"
                  name="confirmarEmail"
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-[#003194] mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-[#003194] mb-2">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  placeholder="Repita a senha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                />
              </div>
            </div>

            {/* Dados da hospedagem */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-[#003194] mb-6">Dados da hospedagem</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="nomeHospedagem" className="block text-sm font-medium text-[#003194] mb-2">
                    Nome da hospedagem
                  </label>
                  <input
                    type="text"
                    id="nomeHospedagem"
                    name="nomeHospedagem"
                    placeholder="Insira o nome da hospedagem"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-[#003194] mb-2">
                    Tipo
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  >
                    <option value="">Selecione o tipo de hospedagem</option>
                    <option value="hotel">Hotel</option>
                    <option value="pousada">Pousada</option>
                    <option value="resort">Resort</option>
                    <option value="hostel">Hostel</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-[#003194] mb-2">
                    CEP
                  </label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    placeholder="00000-000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="rua" className="block text-sm font-medium text-[#003194] mb-2">
                    Rua
                  </label>
                  <input
                    type="text"
                    id="rua"
                    name="rua"
                    placeholder="Rua"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-[#003194] mb-2">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="bairro"
                    name="bairro"
                    placeholder="Bairro"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-[#003194] mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    placeholder="Estado"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="pais" className="block text-sm font-medium text-[#003194] mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    id="pais"
                    name="pais"
                    placeholder="País"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-[#003194] mb-2">
                  Nome da empresa
                </label>
                <input
                  type="text"
                  id="nomeEmpresa"
                  name="nomeEmpresa"
                  placeholder="Ex: Hotel Fazenda S.A ou João Pedro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="cnpj" className="block text-sm font-medium text-[#003194] mb-2">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    placeholder="00.000.000/0000-00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="inscricaoEstadual" className="block text-sm font-medium text-[#003194] mb-2">
                    Inscrição Estadual
                  </label>
                  <input
                    type="text"
                    id="inscricaoEstadual"
                    name="inscricaoEstadual"
                    placeholder="Inscrição na Receita Estadual"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Cadastur */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-[#003194] mb-6">Cadastur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="numeroCadastur" className="block text-sm font-medium text-[#003194] mb-2">
                    Insira o número
                  </label>
                  <input
                    type="text"
                    id="numeroCadastur"
                    name="numeroCadastur"
                    placeholder="Ex: 1234"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="dataExpiracao" className="block text-sm font-medium text-[#003194] mb-2">
                    Data de Expiração
                  </label>
                  <input
                    type="date"
                    id="dataExpiracao"
                    name="dataExpiracao"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Termos e Condições */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3 mb-6">
                <input
                  type="checkbox"
                  id="termos"
                  name="termos"
                  className="mt-1 h-4 w-4 text-[#003194] focus:ring-[#003194] border-gray-300 rounded"
                />
                <label htmlFor="termos" className="text-sm text-gray-700 leading-relaxed">
                  Autorizo a Despegar e suas entidades relacionadas a utilizar os meus dados e/ou os de titular para
                  obter informações financeiras comerciais, de crédito e realizar consultas sobre bases de dados
                  necessárias aos serviços solicitados, conforme Política de Privacidade da Despegar e Política de
                  Privacidade da Viajemos.
                </label>
              </div>
            </div>

            {/* Botão de Submit */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#003194] text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-[#002a7a] transition-colors duration-200"
              >
                REGISTRE-SE
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default AffiliatePage;