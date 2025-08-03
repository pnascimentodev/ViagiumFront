import { useState, useEffect } from "react";
import { FaCreditCard, FaBarcode, FaMoneyCheckAlt} from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { maskCardNumber, maskExpiryMonth, maskExpiryYear } from "../../utils/masks";
import Navbar from '../../components/Navbar';
import Footer from "../../components/Footer";

const paymentMethods = [
  { id: "pix", name: "PIX", icon: FaPix },
  { id: "boleto", name: "Boleto", icon: FaBarcode },
  { id: "credito", name: "Cartão de Crédito", icon: FaCreditCard },
  { id: "debito", name: "Cartão de Débito", icon: FaMoneyCheckAlt },
];

export default function Payment() {

    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [cardForm, setCardForm] = useState({
    holderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    ccv: "",
    });

    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"success" | "error" | "pending">("pending");

    const paymentMethodMap: { [key: string]: number } = {
        "pix": 1,
        "boleto": 2,
        "credito": 3,
        "debito": 4,
    };

  // Status config
    const statusConfig = {
        success: { bgColor: "bg-green-100", color: "text-green-600", text: "Pagamento aprovado!" },
        error: { bgColor: "bg-red-100", color: "text-red-600", text: "Pagamento recusado!" },
        pending: { bgColor: "bg-gray-100", color: "text-gray-600", text: "Aguardando confirmação..." },
    }[paymentStatus];

    const StatusIcon = paymentStatus === "success"
    ? FaCreditCard
    : paymentStatus === "error"
    ? FaBarcode
    : FaMoneyCheckAlt;

    interface Reservation {
      id: number;
      startDate: Date;
      totalPrice: string;
    }

    // TODO: Get reservation details from props or API
    const [reservationDetails] = useState<Reservation | null>(null);

    // TODO: Load reservation data on component mount
    useEffect(() => {
        // Example: Load reservation from URL params or props
        // const reservationId = new URLSearchParams(window.location.search).get('reservationId');
        // if (reservationId) {
        //     loadReservationDetails(reservationId);
        // }
    }, []);

    function handleCardInputChange(field: string, value: string) {
        setCardForm((prev: any) => ({ ...prev, [field]: value }));
        setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }

    function validateCardForm() {
        const newErrors: any = {};
        if (!cardForm.holderName) newErrors.holderName = "Nome obrigatório";
        if (!cardForm.cardNumber) {
            newErrors.cardNumber = "Número obrigatório";
        } else if (cardForm.cardNumber.replace(/\s/g, "").length !== 16) {
        newErrors.cardNumber = "O número do cartão deve ter 16 dígitos";
        }
        if (!cardForm.expiryMonth) {
            newErrors.expiryMonth = "Mês obrigatório";
        } else if (cardForm.expiryMonth.replace(/\D/g, "").length !== 2) {
            newErrors.expiryMonth = "O mês deve ter 2 dígitos";
        }
        if (!cardForm.expiryYear) {
            newErrors.expiryYear = "Ano obrigatório";
        } else if (cardForm.expiryYear.replace(/\D/g, "").length !== 2) {
            newErrors.expiryYear = "O ano deve ter 2 dígitos";
        }
        if (!cardForm.ccv) {
            newErrors.ccv = "CVV obrigatório";
        } else if (cardForm.ccv.replace(/\D/g, "").length !== 3) {
            newErrors.ccv = "O CVV deve ter 3 dígitos";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        if (!selectedMethod) {
            setErrors({ paymentMethod: "Selecione um método de pagamento" });
            setIsSubmitting(false);
            return;
        }

        if (selectedMethod === "credito" || selectedMethod === "debito") {
        if (!validateCardForm()) {
            setIsSubmitting(false);
            return;
        }
        }

        if (!reservationDetails) {
            setErrors({ general: "Dados da reserva não encontrados" });
            setIsSubmitting(false);
            return;
        }

        const getRemoteIp = () => {
            // TODO: Implement real IP detection
            return "127.0.0.1";
        };

        // Prepare payment data for API
        const paymentData = {
            reservationId: reservationDetails.id,
            paymentMethod: paymentMethodMap[selectedMethod || ""],
            holderName: cardForm.holderName,
            cardNumber: cardForm.cardNumber.replace(/\s/g, ""), // Remove spaces
            expiryMonth: cardForm.expiryMonth,
            expiryYear: cardForm.expiryYear,
            ccv: cardForm.ccv,
            remoteIp: getRemoteIp(),
        };

        console.log("Payment data to be sent to API:", paymentData);
        
        try {
            // TODO: Make actual API call
            // const response = await paymentAPI.processPayment(paymentData);
            // setPaymentStatus(response.success ? "success" : "error");
            
            // Placeholder - remove when implementing real API
            setPaymentStatus("pending");
        } catch (error) {
            console.error("Payment error:", error);
            setPaymentStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <div>
      <Navbar />

    <div className="min-h-screen h-full bg-gray-50 py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Confirme o Pagamento</h1>
        <p className="text-gray-600">Selecione o método de pagamento e complete as informações</p>
      </div>

      <div className="flex justify-center items-center">
      <div className="max-w-2xl w-full bg-[#FFFFFF] mb-20 rounded-xl shadow-2xl p-6">
        <div className="ml-6 mt-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-2">Detalhes do Pacote</h2>
        </div>
        <div className="space-y-1 ml-6">
          {reservationDetails ? (
            <>
              <div><span className="font-semibold text-gray-700">Data:</span> {reservationDetails.startDate.toLocaleDateString()}</div>
              <div><span className="font-semibold text-gray-700">Valor Total:</span> {reservationDetails.totalPrice}</div>
            </>
          ) : (
            <div className="text-gray-500">Carregando detalhes da reserva...</div>
          )}
        </div>
        <hr className="w-full mb-2 mt-2" />
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethod(method.id);
                      setErrors((prev: any) => ({ ...prev, paymentMethod: "" }));
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                      selectedMethod === method.id
                        ? "border-[#FFA62B] bg-orange-50"
                        : "border-gray-200 hover:border-[#FFA62B]"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${selectedMethod === method.id ? "text-[#FFA62B]" : "text-gray-600"}`} />
                    <span
                      className={`text-sm font-medium ${
                        selectedMethod === method.id ? "text-[#FFA62B]" : "text-gray-700"
                      }`}
                    >
                      {method.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.paymentMethod && <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>}
          </div>

          {/* Card Form - Show only for credit/debit cards */}
          {(selectedMethod === "credito" || selectedMethod === "debito") && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4 ">Informações do Cartão</h2>
              <div className="space-y-4">
                {/* Cardholder Name */}
                <div>
                  <label htmlFor="holderName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Portador
                  </label>
                  <input
                    type="text"
                    id="holderName"
                    value={cardForm.holderName}
                    onChange={(e) => handleCardInputChange("holderName", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${
                      errors.holderName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nome completo como no cartão"
                  />
                  {errors.holderName && <p className="text-red-500 text-sm mt-1">{errors.holderName}</p>}
                </div>

                {/* Card Number */}
                <div className="mt-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardForm.cardNumber}
                    onChange={(e) =>
                    handleCardInputChange("cardNumber", maskCardNumber(e.target.value))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${
                      errors.cardNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>

                {/* Expiration Date and CVV */}
                <div className="grid grid-cols-3 mt-2 gap-6">
                  <div>
                    <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
                      Mês
                    </label>
                    <input
                      type="text"
                      id="expiryMonth"
                      value={cardForm.expiryMonth}
                      onChange={(e) => handleCardInputChange("expiryMonth", maskExpiryMonth(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${
                        errors.expiryMonth ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="MM"
                    />
                    {errors.expiryMonth && <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>}
                  </div>
                  <div>
                    <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Ano
                    </label>
                    <input
                      type="text"
                      id="expiryYear"
                      value={cardForm.expiryYear}
                      onChange={(e) => handleCardInputChange("expiryYear", maskExpiryYear(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${
                        errors.expiryYear ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="YY"
                    />
                    {errors.expiryYear && <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>}
                  </div>
                  <div>
                    <label htmlFor="ccv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="ccv"
                      value={cardForm.ccv}
                      onChange={(e) => handleCardInputChange("ccv", e.target.value.replace(/\D/g, "").slice(0, 3))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${
                        errors.ccv ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="123"
                    />
                    {errors.ccv && <p className="text-red-500 text-sm mt-1">{errors.ccv}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4 ">Status do Pagamento</h2>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${statusConfig.bgColor}`}>
              <StatusIcon className={`w-5 h-5 mr-2 ${statusConfig.color}`} />
              <span className={`font-medium ${statusConfig.color}`}>{statusConfig.text}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FFA62B] hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 mt-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processando...
              </>
            ) : (
              "Confirmar Pagamento"
            )}
          </button>
        </form>
      </div>
    </div>
    </div>
    <Footer />
    </div>
  );
}
