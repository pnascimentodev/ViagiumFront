import { Button } from "../../components/Button.tsx"
import logo from "../../assets/img/logo.svg"
import { FaUser, FaCalendarAlt, FaChartLine, FaPercentage, FaUsers, FaShieldAlt, FaBullhorn } from "react-icons/fa"

function AffiliatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-700 to-blue-900 relative overflow-hidden">
      {/* Background image - Eiffel Tower */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg"
          alt="Eiffel Tower"
          className="w-full h-full object-cover object-center"/>
    </div>

    {/* Navigation */}
  <header className="relative z-10 w-full px-6 py-4">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
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
      <FaUser className="w-4 h-4 mr-2 text-white fill-white stroke-white"/>
      Login
    </Button>
  </div>
  </div>
</header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-white">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xl text-white md:text-2xl mb-8 font-light">
            Temos alta demanda de hospedagens. O que falta para <br />você anunciar a sua?
          </p>
          <h1 className="text-3xl text-white md:text-4xl font-bold tracking-wide">TORNE-SE UM AFILIADO</h1>
        </div>

        {/* Card vantagens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full">
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
      </main>
    </div>
  )
}

export default AffiliatePage;