import { useState } from "react";
import { FaCreditCard, FaBarcode, FaMoneyCheckAlt} from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { maskCardNumber, maskValidateExpirationDate } from "../../utils/masks";

const paymentMethods = [
  { id: "pix", name: "PIX", icon: FaPix },
  { id: "boleto", name: "Boleto", icon: FaBarcode },
  { id: "credito", name: "Cartão de Crédito", icon: FaCreditCard },
  { id: "debito", name: "Cartão de Débito", icon: FaMoneyCheckAlt },
];

export default function Payment() {

    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [cardForm, setCardForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    });

    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"success" | "error" | "pending">("pending");

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

    const [packageDetails] = useState({
    nome: "Pacote Viagem Rio",
    destino: "Rio de Janeiro",
    duracao: "10/09/2025",
    pessoas: 2,
    preco: 3200.00,
    });

    function handleCardInputChange(field: string, value: string) {
        setCardForm((prev: any) => ({ ...prev, [field]: value }));
        setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }

    function validateCardForm() {
        const newErrors: any = {};
        if (!cardForm.cardholderName) newErrors.cardholderName = "Nome obrigatório";
        if (!cardForm.cardNumber) {
            newErrors.cardNumber = "Número obrigatório";
        } else if (cardForm.cardNumber.replace(/\s/g, "").length !== 16) {
        newErrors.cardNumber = "O número do cartão deve ter 16 dígitos";
        }
        if (!cardForm.expirationDate) {
            newErrors.expirationDate = "Validade obrigatória";
        } else if (cardForm.expirationDate.replace(/\D/g, "").length !== 4) {
            newErrors.expirationDate = "A validade deve ter 4 dígitos";
        }
        if (!cardForm.cvv) {
            newErrors.cvv = "CVV obrigatório";
        } else if (cardForm.cvv.replace(/\D/g, "").length !== 3) {
            newErrors.cvv = "O CVV deve ter 3 dígitos";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        if (selectedMethod === "credito" || selectedMethod === "debito") {
        if (!validateCardForm()) {
            setIsSubmitting(false);
            return;
        }
        }
    
        // Simulação de pagamento
        setTimeout(() => {
        setPaymentStatus("success");
        setIsSubmitting(false);
        }, 2000);
    }

  return (
    <div className="min-h-screen bg-gradient-to-b h-full from-[#003194] to-[#000000] flex justify-center items-center">
      <div className="max-w-2xl w-full bg-[#FFFFFF] mt-20 mb-20 rounded-xl shadow-2xl p-6">
        <h1 className="text-2xl font-bold mb-2 flex justify-center items-center">Confirme o Pagamento</h1>
        <p className="text-gray-600 flex justify-center items-center">Selecione o método de pagamento e complete as informações</p>
        <hr className="w-full mb-2 mt-2" />
        <div className="ml-6 mt-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-2">Detalhes do Pacote</h2>
        </div>
        <div className="space-y-1 ml-6">
          <div><span className="font-semibold text-gray-700">Nome:</span> {packageDetails.nome}</div>
          <div><span className="font-semibold text-gray-700">Destino:</span> {packageDetails.destino}</div>
          <div><span className="font-semibold text-gray-700">Duração:</span> {packageDetails.duracao}</div>
          <div><span className="font-semibold text-gray-700">Pessoas:</span> {packageDetails.pessoas}</div>
          <div className="mb-6"><span className="font-semibold text-gray-700">Preço:</span> R$ {packageDetails.preco.toFixed(2)}</div>
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
                    onClick={() => setSelectedMethod(method.id)}
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
          </div>

          {/* Card Form - Show only for credit/debit cards */}
          {(selectedMethod === "credito" || selectedMethod === "debito") && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4 ">Informações do Cartão</h2>
              <div className="space-y-4">
                {/* Cardholder Name */}
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Portador
                  </label>
                  <input
                    type="text"
                    id="cardholderName"
                    value={cardForm.cardholderName}
                    onChange={(e) => handleCardInputChange("cardholderName", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${
                      errors.cardholderName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nome completo como no cartão"
                  />
                  {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
                </div>

                {/* Card Number */}
                <div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Validade
                    </label>
                    <input
                      type="text"
                      id="expirationDate"
                      value={cardForm.expirationDate}
                      onChange={(e) => handleCardInputChange("expirationDate", maskValidateExpirationDate(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${
                        errors.expirationDate ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="MM/YY"
                    />
                    {errors.expirationDate && <p className="text-red-500 text-sm mt-1">{errors.expirationDate}</p>}
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      value={cardForm.cvv}
                      onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${
                        errors.cvv ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="123"
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
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
  );
}
