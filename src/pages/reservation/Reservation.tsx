
import Navbar from '../../components/Navbar';
import Footer from "../../components/Footer";
import { useEffect, useState } from "react"
import { FaUser, FaMapMarkerAlt, FaUsers, FaDollarSign } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { validateCPF, validateCNPJ, validateRequired } from "../../utils/validations";
import { useNavigate } from "react-router-dom";

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

interface PackageDetails {
  id: number
  packageName: string
  origin: string
  destination: string
  duration: string
  startDate: Date
  totalValue: string
}

interface Reservation{
  id: number
  startDate: string
  totalPrice: string
}

export default function Reservation() {
  // Mock client data
  const [client] = useState<Client>({
    id: 1,
    firstName: "Maria",
    lastName: "Silva Santos",
    documentNumber: "123.456.789-00",
    phoneNumber: "(11) 99999-8888",
    dateOfBirth: "1990-01-01",
  })

  // Mock package data
  const [packageDetails] = useState<PackageDetails>({
    id: 1,
    packageName: "Pacote Viagem Rio de Janeiro",
    origin: "São Paulo",
    destination: "Rio de Janeiro",
    duration: "7 dias",
    startDate: new Date("2023-10-01"),
    totalValue: "R$ 9.824,00",
  })

  const location = useLocation();
  const numPessoas = location.state?.numPessoas || 1;
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
    setPassengers(Array.from({ length: Math.max(numPessoas - 1, 0) }, (_, idx) => ({
      id: idx,
      firstName: "",
      lastName: "",
      documentNumber: "",
      dateOfBirth: "",
    })));
  }, [numPessoas]);
  
  const reservationPayload = {
  userId: client.id,
  travelPackageId: packageDetails.id, // Adicione o campo id ao seu estado
  startDate: new Date().toISOString(), // ou a data escolhida pelo usuário
  totalPrice: parseFloat(packageDetails.totalValue.replace(/[^\d,]/g, '').replace(',', '.')), // ajuste conforme formato
  status: "Pending",
  isActive: true,
  travelers: [
    {
      firstName: client.firstName,
      lastName: client.lastName,
      documentNumber: client.documentNumber,
      dateOfBirth: client.dateOfBirth // adicione ao seu estado client
    },
    ...passengers.map(p => ({
      firstName: p.firstName,
      lastName: p.lastName,
      documentNumber: p.documentNumber,
      dateOfBirth: p.dateOfBirth
    }))
  ],
  // Adicione reservationRooms se houver
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

    function handleConfirmReservation() {
    const errors = validatePassengers();
    setPassengerErrors(errors);
    if (Object.keys(errors).length === 0) {
      navigate("/payment");
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
                <h2 className="text-xl font-semibold">Passageiros</h2>
              </div>
              <div className="space-y-4">
                {passengers.map((passenger, index) => (
                  <div key={passenger.id} className="border border-gray-200 rounded-lg p-4 mt-2">
                    <h3 className="font-medium text-gray-900">Passageiros Adicionais {index + 1}</h3>
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
                      <FaDollarSign className="w-5 h-5 text-[#003194] mr-2" />
                      <h2 className="text-xl font-semibold text-[#003194]">Resumo da Reserva</h2>
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
                        Confirmar Reserva
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
