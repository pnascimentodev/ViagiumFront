import { Button } from '../../components/Button';

export default function PaymentConfirmed() {

  const handleAccessTrips = () => {
    window.location.href = '/travelhistory';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header com Logo */}
        <div className="text-center py-8 px-6">
          <img 
            src="https://res.cloudinary.com/dnuhmdhlu/image/upload/v1753579754/LOGO_VIAGIUM__1_cgsqzh.png" 
            alt="Logo Viagium" 
            className="max-w-[150px] h-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold mb-2">
            Pagamento Confirmado!
          </h1>
        </div>

        {/* Seção de Confirmação Destacada */}
        <div className="mx-6 mb-8">
          <div className="bg-gradient-to-br from-[#00cc88] to-[#00aa77] text-white p-6 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-3">Tudo certo com seu pagamento!</h2>
            <p className="text-lg opacity-90">Sua viagem dos sonhos está oficialmente reservada!</p>
          </div>
        </div>

        <div className="px-6 pb-8">
          {/* Texto Principal */}
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Recebemos o pagamento da sua viagem com sucesso! Agora está tudo pronto para você começar a se preparar para esse momento incrível. 
          </p>

          {/* Botão Acessar Minhas Viagens */}
          <div className="text-center mb-8">
            <Button
              onClick={handleAccessTrips}
              className=""
            >
              Acessar Minhas Viagens
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
 