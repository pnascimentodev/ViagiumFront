import React, { useState } from "react";
import { FaCreditCard, FaBarcode } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { maskCardNumber, maskExpiryMonth, maskExpiryYear, maskCEP } from "../../utils/masks";
import Navbar from '../../components/Navbar';
import Footer from "../../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";

const paymentMethods = [
    { id: "pix", name: "PIX", icon: FaPix },
    { id: "boleto", name: "Boleto", icon: FaBarcode },
    { id: "credito", name: "Cartão de Crédito", icon: FaCreditCard },
];

export default function Payment() {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const navigate = useNavigate();
    const [cardForm, setCardForm] = useState({
        holderName: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        ccv: "",
        streetName: "",
        addressNumber: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
    });

    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"success" | "error" | "pending">("pending");
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
    const [showToast, setShowToast] = useState(false);
    const [pixData, setPixData] = useState<{
        paymentId: string;
        valor: number;
        vencimento: string;
        qrCode: string;
        pixCopiaCola: string;
        mensagem: string;
        instrucoes: string[];
    } | null>(null);

    const paymentMethodMap: { [key: string]: number } = {
        "boleto": 0,
        "pix": 1,
        "credito": 2,
    };

    const location = useLocation();
    const { reservationData } = location.state || {};
    const reservationId = reservationData?.reservationId;

    // Função para exibir toast
    const showToastMessage = (message: string, type: "success" | "error" | "info") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    // Função para buscar QR Code do PIX
    const getPixQrCode = async (cpf: string) => {
        try {
            const formData = new URLSearchParams();
            formData.append('cpf', cpf);

            const response = await fetch("https://viagium.azurewebsites.net/api/Payment/GetPixQrCodeByCpf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.erro || 'Erro ao obter QR Code PIX';
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setPixData(result);
        } catch (error: any) {
            let errorMessage = error.message;

            // Tratamento específico para erro de conexão
            if (error.message?.includes('ERR_CONNECTION_REFUSED') ||
                error.code === 'ERR_CONNECTION_REFUSED' ||
                error.message?.includes('Failed to fetch') ||
                error.name === 'TypeError') {
                errorMessage = "Falha ao se comunicar com o servidor de pagamento";
            }

            showToastMessage(errorMessage, "error");
        }
    };

    function handleCardInputChange(field: string, value: string) {
      // Aplica máscara de CEP
        if (field === "zipCode") value = maskCEP(value);
        setCardForm((prev: any) => ({ ...prev, [field]: value }));
        setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
    //validação dos dados do cartão
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
        if (!cardForm.streetName) newErrors.streetName = "Rua obrigatória";
        if (!cardForm.addressNumber) newErrors.addressNumber = "Número obrigatório";
        if (!cardForm.neighborhood) newErrors.neighborhood = "Bairro obrigatório";
        if (!cardForm.city) newErrors.city = "Cidade obrigatória";
        if (!cardForm.state) newErrors.state = "Estado obrigatório";
        if (!cardForm.zipCode) newErrors.zipCode = "CEP obrigatório";
        if (!cardForm.country) newErrors.country = "País obrigatório";
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

        // Only validate card form for credit card payments
        if (selectedMethod === "credito") {
            if (!validateCardForm()) {
                setIsSubmitting(false);
                return;
            }
        }


        if (!reservationData) {
            setErrors({ general: "Dados da reserva não encontrados" });
            setIsSubmitting(false);
            return;
        }

        const getRemoteIp = () => {
            // TODO: Implement real IP detection
            return "127.0.0.1";
        };

        // Prepare payment data for API
        const formData = new URLSearchParams();
        formData.append('reservationId', reservationId.toString());
        formData.append('paymentMethod', paymentMethodMap[selectedMethod || ""].toString());
        formData.append('holderName', cardForm.holderName);
        formData.append('cardNumber', cardForm.cardNumber.replace(/\s/g, ""));
        formData.append('expiryMonth', cardForm.expiryMonth);
        formData.append('expiryYear', cardForm.expiryYear);
        formData.append('ccv', cardForm.ccv);
        formData.append('remoteIp', getRemoteIp());
        formData.append('streetName', cardForm.streetName);
        formData.append('addressNumber', cardForm.addressNumber);
        formData.append('neighborhood', cardForm.neighborhood);
        formData.append('city', cardForm.city);
        formData.append('state', cardForm.state);
        formData.append('zipCode', cardForm.zipCode);
        formData.append('country', cardForm.country);


        try {
            setPaymentStatus("pending");

            console.log("Dados enviados no formData:");
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const response = await fetch("https://viagium.azurewebsites.netapi/Payment/CreatePayment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();

                // Mapear diferentes tipos de erro para mensagens amigáveis
                let errorMessage: string;

                if (errorData.tipoErro === "VALIDATION_ERROR") {
                    errorMessage = errorData.detalhes || "Dados inválidos fornecidos";
                } else if (errorData.tipoErro === "BUSINESS_RULE_ERROR") {
                    errorMessage = errorData.detalhes || "Operação não permitida";
                } else if (errorData.tipoErro === "EXTERNAL_API_ERROR") {
                    errorMessage = "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
                } else if (errorData.tipoErro === "NOT_FOUND_ERROR") {
                    errorMessage = errorData.mensagemFront || errorData.detalhes || "Recurso não encontrado";
                } else if (errorData.tipoErro === "ACCOUNT_NOT_FOUND_ERROR") {
                    errorMessage = "É necessário criar uma conta de cliente antes de realizar pagamentos. Entre em contato com o suporte.";
                } else if (errorData.tipoErro === "PAYMENT_DECLINED_ERROR") {
                    errorMessage = "O pagamento com cartão de crédito foi negado. Verifique os dados do cartão ou tente outro cartão.";
                } else if (errorData.tipoErro === "PAYMENT_PROCESSING_ERROR") {
                    errorMessage = "Não foi possível processar o pagamento. Verifique os dados informados e tente novamente.";
                } else if (errorData.tipoErro === "INTERNAL_SERVER_ERROR") {
                    errorMessage = "Erro interno do servidor. Tente novamente ou entre em contato com o suporte.";
                } else {
                    errorMessage = errorData.erro || errorData.detalhes || "Erro ao processar pagamento";
                }

                showToastMessage(errorMessage, "error");
                return;
            }

            const result = await response.json();
            console.log("Payment response:", result);
            if (selectedMethod === "pix") {
                setPaymentStatus("pending");
                showToastMessage("QR Code PIX gerado! Aguardando confirmação do pagamento.", "info");
            }
            else if(selectedMethod === "boleto"){
                setPaymentStatus("pending");
                showToastMessage("Boleto gerado com sucesso! O download será iniciado automaticamente", "info");
            }
            else {
                setPaymentStatus("success");
                showToastMessage("Pagamento realizado com sucesso!", "success");
                if (selectedMethod === "credito") {
                  navigate('/paymentconfirmed');
                }
            }


            // Se o metodo de pagamento for PIX, buscar o QR Code
            if (selectedMethod === "pix") {
                // Para PIX, usamos um CPF de teste ou dos dados da reserva
                const cpfForPix = reservationData?.cpf; // CPF da reserva ou CPF de teste // CPF de teste
                await getPixQrCode(cpfForPix);
            }

            // Se for boleto e tiver URL, fazer download automático
            if (selectedMethod === "boleto" && result.boletoUrl) {
                try {
                    // Criar elemento de link temporário para download
                    const link = document.createElement('a');
                    link.href = result.boletoUrl;
                    link.download = `boleto_${result.pagamentoId}.pdf`;
                    link.target = '_blank';

                    // Adicionar ao DOM, clicar e remover
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Mostrar mensagem de sucesso específica para boleto
                    if (result.mensagemBoleto) {
                        showToastMessage(result.mensagemBoleto, "success");
                    }
                } catch (downloadError) {
                    console.error("Erro ao fazer download do boleto:", downloadError);
                    showToastMessage("Boleto gerado com sucesso, mas houve erro no download automático. Tente novamente.", "error");
                }
            }
        } catch (error: any) {
            console.error("Payment API error:", error);
            setPaymentStatus("error");

            let errorMessage = error.message || "Erro ao processar pagamento";

            // Tratamento específico para erro de conexão
            if (error.message?.includes('ERR_CONNECTION_REFUSED') ||
                error.code === 'ERR_CONNECTION_REFUSED' ||
                error.message?.includes('Failed to fetch') ||
                error.name === 'TypeError') {
                errorMessage = "Falha ao se comunicar com o servidor de pagamento";
            }

            showToastMessage(errorMessage, "error");
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
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                    className={`min-w-[100px] max-w-[120px] p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 mx-auto ${
                      selectedMethod === method.id
                        ? "border-[#FFA62B] bg-orange-50"
                        : "border-gray-200 hover:border-[#FFA62B]"
                    }`}
                    style={{ width: '100%', maxWidth: 120, minWidth: 100 }}
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

          {/* Card Form - Show only for credit/ cards */}
          {(selectedMethod === "credito") && (
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

                {/* Address Fields */}
                              <h2 className="text-xl font-semibold mb-4 mt-6 ">Endereço de Cobrança</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                    <input
                      type="text"
                      id="zipCode"
                      value={cardForm.zipCode}
                      onChange={e => handleCardInputChange("zipCode", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${errors.zipCode ? "border-red-500" : "border-gray-300"}`}
                      placeholder="00000-000"
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                  <div>
                    <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                    <input
                      type="text"
                      id="streetName"
                      value={cardForm.streetName}
                      onChange={e => handleCardInputChange("streetName", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${errors.streetName ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Rua"
                    />
                    {errors.streetName && <p className="text-red-500 text-sm mt-1">{errors.streetName}</p>}
                  </div>
                  <div>
                    <label htmlFor="addressNumber" className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                    <input
                      type="number"
                      id="addressNumber"
                      value={cardForm.addressNumber}
                      onChange={e => handleCardInputChange("addressNumber", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${errors.addressNumber ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Número"
                    />
                    {errors.addressNumber && <p className="text-red-500 text-sm mt-1">{errors.addressNumber}</p>}
                  </div>
                  <div>
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                    <input
                      type="text"
                      id="neighborhood"
                      value={cardForm.neighborhood}
                      onChange={e => handleCardInputChange("neighborhood", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${errors.neighborhood ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Bairro"
                    />
                    {errors.neighborhood && <p className="text-red-500 text-sm mt-1">{errors.neighborhood}</p>}
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input
                      type="text"
                      id="city"
                      value={cardForm.city}
                      onChange={e => handleCardInputChange("city", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${errors.city ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Cidade"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <input
                      type="text"
                      id="state"
                      value={cardForm.state}
                      onChange={e => handleCardInputChange("state", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${errors.state ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Estado"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <input
                      type="text"
                      id="country"
                      value={cardForm.country}
                      onChange={e => handleCardInputChange("country", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA62B] ${errors.country ? "border-red-500" : "border-gray-300"}`}
                      placeholder="País"
                    />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PIX QR Code - Show when PIX is selected and pixData is available */}
          {selectedMethod === "pix" && pixData && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4">Pagamento PIX</h2>
              <div className="text-center space-y-4">

                {/* Valor e informações do pagamento */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Valor: R$ {pixData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Vencimento: {new Date(pixData.vencimento).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600">
                    ID do Pagamento: {pixData.paymentId}
                  </p>
                </div>

                {/* QR Code Image */}
                <div className="flex justify-center">
                  <img
                    src={pixData.qrCode}
                    alt="QR Code PIX"
                    className="w-48 h-48 border-2 border-gray-200 rounded-lg"
                  />
                </div>

                {/* Mensagem de sucesso */}
                <p className="text-green-600 font-medium">{pixData.mensagem}</p>

                {/* Instructions */}
                <div className="text-left bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Como pagar:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {pixData.instrucoes.map((instrucao, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {instrucao}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Copy and Paste Code */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código PIX (Copia e Cola):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={pixData.pixCopiaCola}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(pixData.pixCopiaCola);
                        showToastMessage("Código PIX copiado para a área de transferência!", "success");
                      }}
                      className="px-4 py-2 bg-[#FFA62B] text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Submit Button */}
          {paymentStatus === "success" ? (
            <button
              type="button"
              onClick={() => navigate('/paymentconfirmed')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 mt-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Ir para confirmação
            </button>
          ) : (
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
          )}
        </form>

        {/* Toast Message */}
        {showToast && (
          <div className={`fixed top-5 left-5 mt-4 ml-4 p-4 rounded-lg shadow-lg transition-all duration-300 z-50 ${toastType === "success" ? "bg-green-100" : "bg-red-100"}`}>
            <div className={`flex items-center ${toastType === "success" ? "text-green-800" : "text-red-800"}`}>
              {toastType === "success" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">{toastMessage}</span>
              <button
                onClick={() => setShowToast(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
    <Footer />


    </div>
  );
}
