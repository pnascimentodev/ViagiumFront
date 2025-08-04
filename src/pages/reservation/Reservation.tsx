
import Navbar from '../../components/Navbar';
import Footer from "../../components/Footer";
import { useEffect, useState } from "react"
import { FaUser, FaMapMarkerAlt, FaUsers, FaDollarSign } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { validateCPF, validateCNPJ, validateRequired } from "../../utils/validations";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Client {
  id: number
  firstName: string
  lastName: string
  documentNumber: string
  phoneNumber: string
  dateOfBirth: string 
}

interface Passenger {
  id: number
  firstName: string
  lastName: string
  documentNumber: string
  dateOfBirth: string
}

interface Reservation{
  id: number
  startDate: Date
  totalPrice: string
}

export default function Reservation() {
  const location = useLocation();
  const { reservationData, displayData } = location.state || {};
  
  console.log('Dados recebidos do Package:', location.state);
  console.log('reservationData:', reservationData);
  console.log('displayData:', displayData);
  
  const numPessoas = displayData?.numPessoas || 1;

  const [client] = useState<Client>({
    id: 3,
    firstName: "João",
    lastName: "Silva",
    documentNumber: "03159792080",
    phoneNumber: "(11) 91234-5678",
    dateOfBirth: "1990-05-15",
  })


  const packageDetails = {
    id: reservationData?.travelPackageId || 1,
    packageName: displayData?.packageTitle || "Pacote não informado",
    origin: displayData?.originCity && displayData?.originCountry 
      ? `${displayData.originCity}, ${displayData.originCountry}` 
      : "Origem não informada",
    destination: displayData?.destinationCity && displayData?.destinationCountry 
      ? `${displayData.destinationCity}, ${displayData.destinationCountry}` 
      : "Destino não informado",
    duration: displayData?.duration?.toString() || "Duração não informada",
    startDate: reservationData?.startDate ? new Date(reservationData.startDate) : new Date(),
    totalValue: `R$ ${displayData?.finalValue?.toLocaleString('pt-BR') || '0'},00`,
  }
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: Math.max(numPessoas - 1, 0) }, (_, idx) => ({
      id: idx,
      firstName: "",
      lastName: "",
      documentNumber: "",
      dateOfBirth: "",
    }))
  );

  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect - Atualizando passengers para numPessoas:', numPessoas);
    setPassengers(Array.from({ length: Math.max(numPessoas - 1, 0) }, (_, idx) => ({
      id: idx,
      firstName: "",
      lastName: "",
      documentNumber: "",
      dateOfBirth: "",
    })));
  }, [numPessoas]);
  
  // Função para criar o payload da reserva
  const createReservationPayload = () => {
    return {
      userId: client.id,
      travelPackageId: reservationData?.travelPackageId || packageDetails.id,
      hotelId: reservationData?.hotelId || 0,
      roomTypeId: reservationData?.roomTypeId || 0,
      travelers: passengers.map(p => ({
          firstName: p.firstName,
          lastName: p.lastName,
          documentNumber: p.documentNumber,
          dateOfBirth: p.dateOfBirth
        }))
      };
  };

  const updatePassenger = (id: number, field: keyof Passenger, value: string) => {
    setPassengers(passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  function validatePassengers() {
  const errors: { [key: string]: string } = {};
  passengers.forEach((p, idx) => {
    if (!validateRequired(p.firstName)) errors[`firstName${idx}`] = "Nome obrigatório";
    if (!validateRequired(p.lastName)) errors[`lastName${idx}`] = "Sobrenome obrigatório";
    if (!validateRequired(p.documentNumber)) {
      errors[`documentNumber${idx}`] = "Documento obrigatório";
    } else if (!validateCPF(p.documentNumber) && !validateCNPJ(p.documentNumber)) {
      errors[`documentNumber${idx}`] = "Documento deve ser CPF ou CNPJ válido";
    }
    if (!validateRequired(p.dateOfBirth)) errors[`dateOfBirth${idx}`] = "Data de nascimento obrigatória";
  });
  return errors;
  }
    const [passengerErrors, setPassengerErrors] = useState<{ [key: string]: string }>({});

    async function handleConfirmReservation() {
      const errors = validatePassengers();
      setPassengerErrors(errors);
      if (Object.keys(errors).length === 0) {
        try {
          const payload = createReservationPayload();
          // Cria a reserva na API
          const response = await axios.post("http://localhost:5028/api/Reservation", payload, {
            headers: { "Content-Type": "application/json" }
          });

          // Se sucesso, navega para pagamento com os dados da reserva criada
          if (response.data) {
            navigate("/payment", {
              state: {
                reservationData: response.data, // dados da reserva criada
                displayData,
                passengerData: passengers,
                clientData: client,
                packageDetails,
                createReservationPayload: payload
              }
            });
          }
        } catch (error) {
          alert("Erro ao criar reserva. Tente novamente.");
          console.error(error);
        }
      }
    }

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Confirme sua Reserva</h1>
            <p className="text-gray-600">Revise as informações e confirme sua reserva</p>
          </div>

          <div>
            {/* Customer Information */}
            <div className="bg-white p-6">
              <div className="flex items-center mb-4 ml-6">
                <FaUser className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-semibold">Informações do Cliente</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4 ml-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Nome:</span>
                    <p className="text-gray-900 font-medium">{client.firstName} {client.lastName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Sobrenome:</span>
                    <p className="text-gray-900 font-medium">{client.lastName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">CPF ou Passaporte:</span>
                    <p className="text-gray-900">{client.documentNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Contato:</span>
                    <p className="text-gray-900">{client.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="mt-4 p-6">
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="w-5 h-5  mr-2" />
                  <h2 className="text-xl font-semibold">Detalhes do Pacote</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Nome do Pacote:</span>
                      <p className="text-gray-900 font-medium">{packageDetails.packageName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Origem:</span>
                      <p className="text-gray-900">{packageDetails.origin}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Destino:</span>
                      <p className="text-gray-900">{packageDetails.destination}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Duração:</span>
                      <p className="text-gray-900">{packageDetails.duration}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Valor Total:</span>
                      <p className="text-2xl font-bold text-[#FFA62B]">{packageDetails.totalValue}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Passengers */}
          {passengers.length > 0 && (
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaUsers className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-semibold">Passageiros Adicionais</h2>
              </div>
              <div className="space-y-4">
                {passengers.map((passenger, index) => (
                  <div key={passenger.id} className="border border-gray-200 rounded-lg p-4 mt-2">
                    <h3 className="font-medium text-gray-900">Passageiro {index + 1}</h3>
                    <div className="grid md:grid-cols-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) => updatePassenger(passenger.id, "firstName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFA62B] focus:border-transparent"
                          placeholder="Digite o nome"
                        />
                        {passengerErrors[`firstName${index}`] && (
                          <span className="text-red-500 text-xs">{passengerErrors[`firstName${index}`]}</span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                        <input
                          type="text"
                          value={passenger.lastName || ""}
                          onChange={(e) => updatePassenger(passenger.id, "lastName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFA62B] focus:border-transparent"
                          placeholder="Digite o sobrenome"
                        />
                        {passengerErrors[`lastName${index}`] && (
                          <span className="text-red-500 text-xs">{passengerErrors[`lastName${index}`]}</span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF ou Passaporte</label>
                        <input
                            type="text"
                            value={passenger.documentNumber}
                            onChange={(e) => updatePassenger(passenger.id, "documentNumber", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFA62B] focus:border-transparent"
                            placeholder="CPF ou CNPJ"
                          />
                          {passengerErrors[`documentNumber${index}`] && (
                          <span className="text-red-500 text-xs">{passengerErrors[`documentNumber${index}`]}</span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                        <input
                          type="date"
                          value={passenger.dateOfBirth}
                          onChange={(e) => updatePassenger(passenger.id, "dateOfBirth", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFA62B] focus:border-transparent"
                        />
                        {passengerErrors[`dateOfBirth${index}`] && (
                          <span className="text-red-500 text-xs">{passengerErrors[`dateOfBirth${index}`]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

                  {/* Resumo da Reserva */}
                  <div className="bg-white rounded-lg mt-4 shadow-md p-6">
                    <div className="flex items-center mb-4">
                      <FaDollarSign className="w-5 h-5 mr-2" />
                      <h2 className="text-xl font-semibold">Resumo da Reserva</h2>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Pacote Principal:</span>
                        <span className="font-medium">{packageDetails.packageName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Passageiros Adicionais:</span>
                        <span className="font-medium">{passengers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Duração:</span>
                        <span className="font-medium">{packageDetails.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Data de Início:</span>
                        <span className="font-medium">{packageDetails.startDate.toLocaleDateString()}</span>
                      </div>
                      <hr className="my-3" />
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-gray-900">Valor Total:</span>
                        <span className="font-bold text-[#FFA62B] text-xl">{packageDetails.totalValue}</span>
                      </div>
                    </div>

                      <button
                        className="w-full bg-[#FFA62B] text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-[#e8941f] transition-colors duration-200 shadow-md hover:shadow-lg"
                        onClick={handleConfirmReservation}
                      >
                        Prosseguir para Pagamento

                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
  )
}
