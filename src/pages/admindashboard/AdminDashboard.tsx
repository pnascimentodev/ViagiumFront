import type React from "react"
import { useEffect, useState } from "react"
import { FaChartBar, FaBox, FaUsers, FaUserTie, FaHotel, FaPlus, FaEdit, FaDollarSign, FaMoneyBill, FaBolt, FaShoppingCart, FaTimes, FaToggleOn, FaToggleOff, FaEye } from "react-icons/fa"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import { formatBRL } from "../../utils/currency"

interface MenuItem {
    id: string
    label: string
    icon: React.ReactNode
}

interface TableData {
    id: number
    name: string
    status: string
    date: string
    value?: string
    remainingSlots?: number
}

interface UserFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    documentNumber: string
    birthDate: string
    role: string
    isActive: boolean
}

interface AffiliateFormData {
    corporateName: string
    tradeName: string
    cnpj: string
    stateRegistration: string
    phone: string
    email: string
    cep: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    country: string
    isActive: boolean
}

interface HotelFormData {
    name: string
    description: string
    street: string
    number: string
    neighborhood: string
    city: string
    cep: string
    state: string
    country: string
    phone: string
    email: string
    isActive: boolean
    star: number
}

interface PackageFormData {
    title: string;
    description: string;
    originAddress: { city: string; country: string };
    destinationAddress: { city: string; country: string };
    image: File | null;
    imageUrl?: string; // caso de edição, pode já ter uma imagem carregada no banco
    duration: string;
    maxPeople: string;
    vehicleType: string;
    originalPrice: string;
    isActive: boolean;
    // Novos campos para os tipos de pacote
    packageType: "fixed" | "seasonal" | "recurring";
    packageTax: string;
    cupomDiscount: string;
    discountValue: string;
    // Campos para pacote com data fixa
    fixedStartDate: string;
    // Campos para pacote sazonal (2x ao ano)
    seasonalPeriods: Array<{
        startDate: string;
        endDate: string;
        isAvailable: boolean;
    }>;
    // Campos para pacote recorrente
    recurrenceStartDate: string;
    recurrenceEndDate: string;
    intervalDays: string;
}

interface ClientFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    documentNumber: string
    birthDate: string
    isActive: boolean
}

// Constantes movidas para BaseModal
const PRIMARY_COLOR = "#003194";
const MODAL_OVERLAY_GRADIENT = `linear-gradient(135deg, rgba(0, 49, 148, 0.9), rgba(247, 126, 40, 0.9))`;

function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalType, setModalType] = useState<"pacotes" | "usuarios" | null>(null)


    // Funções utilitárias para buscar dados específicos, ao clicar no botão de visualizar ou editar da tabela
    function getPackageById(packageId: number) {
        return allPackages.find((p: any) => p.travelPackageId === packageId);
    }

    function getUserById(userId: number) {
        return allUsers.find((u: any) => u.userId === userId);
    }

    function getAffiliateById(affiliateId: number) {
        return allAffiliates.find((a: any) => a.affiliateId === affiliateId);
    }

    function getHotelById(hotelId: number) {
        return allHotels.find((h: any) => h.hotelId === hotelId);
    }

    function getClientById(clientId: number) {
        return allClients.find((c: any) => c.userId === clientId);
    }

    // Adicione um novo estado para controlar o modal de Criação de PACOTES E AFILIADOS
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const openModal = (type: "pacotes" | "usuarios") => {
        setModalType(type)
        setIsModalOpen(true)
        // Reset forms
        if (type === "pacotes") {
            setPackageForm({
                title: "",
                description: "",
                originAddress: { city: "", country: "" },
                destinationAddress: { city: "", country: "" },
                image: null,
                duration: "",
                maxPeople: "",
                vehicleType: "",
                originalPrice: "",
                isActive: true,
                // Novos campos
                packageType: "fixed",
                packageTax: "",
                cupomDiscount: "",
                discountValue: "",
                // Campos para pacote com data fixa
                fixedStartDate: "",
                // Campos para pacote sazonal
                seasonalPeriods: [
                    { startDate: "", endDate: "", isAvailable: true },
                    { startDate: "", endDate: "", isAvailable: true }
                ],
                // Campos para pacote recorrente
                recurrenceStartDate: "",
                recurrenceEndDate: "",
                intervalDays: ""
            })
        } else {
            setUserForm({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                documentNumber: "",
                birthDate: "",
                role: "Cliente",
                isActive: true
            })
        }
    }
    const closeModal = () => {
        setIsModalOpen(false)
        setModalType(null)
    }

    // Configuração genérica para ações de ativação/desativação de entidades
    const statusActions: Record<string, {
        activate: { url: (id: number) => string, method: "GET" | "PUT" | "POST" | "DELETE" },
        deactivate: { url: (id: number) => string, method: "GET" | "PUT" | "POST" | "DELETE" }
    }> = {
        // AS AÇÕES DO PACOTE NÃO ESTÃO FUNCIONANDO NO BACKEND. NECESSÁRIO AJUSTAR AQUI DEPOIS DAS CORREÇÕES
        pacotes: {
            activate: { url: id => `http://localhost:5028/api/TravelPackage/activate/${id}`, method: "POST" },
            deactivate: { url: id => `http://localhost:5028/api/TravelPackage/deactivate/${id}`, method: "DELETE" }
        },
        // AS AÇÕES DO AFILIADO NÃO ESTÃO FUNCIONANDO NO BACKEND. NECESSÁRIO AJUSTAR AQUI DEPOIS DAS CORREÇÕES
        afiliados: {
            activate: { url: id => `http://localhost:5028/api/Affiliate/activateById/${id}`, method: "GET" },
            deactivate: { url: id => `http://localhost:5028/api/Affiliate/${id}`, method: "DELETE" }
        },
        hoteis: {
            activate: { url: id => `http://localhost:5028/api/Hotel/${id}/activate`, method: "PUT" },
            deactivate: { url: id => `http://localhost:5028/api/hotel/${id}/desactivate`, method: "DELETE" }
        },
        usuarios: {
            activate: { url: id => `http://localhost:5028/api/admin/${id}/activate`, method: "POST"},
            deactivate: { url: id => `http://localhost:5028/api/admin/${id}`, method: "DELETE" }
        },
        clientes: {
            activate: { url: id => `http://localhost:5028/api/user/activate/${id}`, method: "POST" },
            deactivate: { url: id => `http://localhost:5028/api/user/${id}`, method: "DELETE" }
        }
    };

    // Função genérica para alterar status de qualquer item
    const handleToggleItemStatus = async (item: TableData, tabId: string) => {
        const actionType = item.status === "Ativo" ? "deactivate" : "activate";
        const config = statusActions[tabId]?.[actionType];
        if (!config) {
            alert("Ação não configurada para esta entidade.");
            return;
        }

        try {
            const axios = (await import("axios")).default;
            await axios.request({
                url: config.url(item.id),
                method: config.method
            });
            alert("Status alterado com sucesso!");
            // Atualiza a tabela
            switch (tabId) {
                case "pacotes": fetchPackages(); break;
                case "afiliados": fetchAffiliates(); break;
                case "hoteis": fetchHotels(); break;
                case "usuarios": fetchUsers(); break;
                case "clientes": fetchClients(); break;
            }
        } catch (error) {
            alert("Erro ao alterar status.");
            console.error(error);
        }
    };
    // Funções de visualização (somente leitura) para afiliados e hotéis
    const renderModal = () => {
        if (!isModalOpen || !modalType) return null

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* Overlay com gradiente */}
                <div
                    className="fixed inset-0 bg-opacity-80"
                    onClick={closeModal}
                    style={{
                        background: MODAL_OVERLAY_GRADIENT
                    }}
                />

                {/* Container do Modal - resto do código permanece igual */}
                <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 my-8">
                    {/* Header Fixo */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {modalType === "pacotes" ? "Criar Novo Pacote" : "Criar Novo Usuário Adm"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Área com Scroll */}
                    <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {modalType === "pacotes" ? (
                            <form id="package-form" onSubmit={handlePackageSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título do Pacote</label>
                                    <input
                                        type="text"
                                        required
                                        value={packageForm.title}
                                        onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        required
                                        value={packageForm.description}
                                        onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Descrição detalhada do pacote..."
                                    />
                                </div>

                                {/* Novo campo: Tipo de Pacote */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pacote</label>
                                    <select
                                        required
                                        value={packageForm.packageType}
                                        onChange={(e) => setPackageForm({
                                            ...packageForm,
                                            packageType: e.target.value as "fixed" | "seasonal" | "recurring"
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="fixed">Data Fixa</option>
                                        <option value="seasonal">Sazonal - 2x ao ano</option>
                                        <option value="recurring">Recorrente - O ano todo</option>
                                    </select>
                                </div>

                                {/* Campos condicionais baseados no tipo de pacote */}
                                {packageForm.packageType === "fixed" && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h4 className="text-sm font-medium text-blue-900 mb-3">Configuração de Data Fixa</h4>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                                            <input
                                                type="date"
                                                required
                                                value={packageForm.fixedStartDate}
                                                onChange={(e) => setPackageForm({ ...packageForm, fixedStartDate: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                {packageForm.packageType === "seasonal" && (
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h4 className="text-sm font-medium text-green-900 mb-3">Configuração Sazonal (2 períodos por ano)</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">1º Período</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Data de Início</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={packageForm.seasonalPeriods[0]?.startDate || ""}
                                                            onChange={(e) => {
                                                                const newPeriods = [...packageForm.seasonalPeriods];
                                                                newPeriods[0] = { ...newPeriods[0], startDate: e.target.value };
                                                                setPackageForm({ ...packageForm, seasonalPeriods: newPeriods });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Data de Fim</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={packageForm.seasonalPeriods[0]?.endDate || ""}
                                                            onChange={(e) => {
                                                                const newPeriods = [...packageForm.seasonalPeriods];
                                                                newPeriods[0] = { ...newPeriods[0], endDate: e.target.value };
                                                                setPackageForm({ ...packageForm, seasonalPeriods: newPeriods });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">2º Período</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Data de Início</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={packageForm.seasonalPeriods[1]?.startDate || ""}
                                                            onChange={(e) => {
                                                                const newPeriods = [...packageForm.seasonalPeriods];
                                                                newPeriods[1] = { ...newPeriods[1], startDate: e.target.value };
                                                                setPackageForm({ ...packageForm, seasonalPeriods: newPeriods });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Data de Fim</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={packageForm.seasonalPeriods[1]?.endDate || ""}
                                                            onChange={(e) => {
                                                                const newPeriods = [...packageForm.seasonalPeriods];
                                                                newPeriods[1] = { ...newPeriods[1], endDate: e.target.value };
                                                                setPackageForm({ ...packageForm, seasonalPeriods: newPeriods });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {packageForm.packageType === "recurring" && (
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                        <h4 className="text-sm font-medium text-purple-900 mb-3">Configuração Recorrente</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={packageForm.recurrenceStartDate}
                                                    onChange={(e) => setPackageForm({ ...packageForm, recurrenceStartDate: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={packageForm.recurrenceEndDate}
                                                    onChange={(e) => setPackageForm({ ...packageForm, recurrenceEndDate: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo (dias)</label>
                                                <select
                                                    required
                                                    value={packageForm.intervalDays}
                                                    onChange={(e) => setPackageForm({ ...packageForm, intervalDays: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Selecione</option>
                                                    <option value="7">A cada 7 dias</option>
                                                    <option value="14">A cada 14 dias</option>
                                                    <option value="15">A cada 15 dias</option>
                                                    <option value="30">A cada 30 dias</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade de Origem</label>
                                        <input
                                            type="text"
                                            required
                                            value={packageForm.originAddress.city}
                                            onChange={(e) => setPackageForm({ ...packageForm, originAddress: { ...packageForm.originAddress, city: e.target.value } })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: São Paulo"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">País de Origem</label>
                                        <input
                                            type="text"
                                            required
                                            value={packageForm.originAddress.country}
                                            onChange={(e) => setPackageForm({ ...packageForm, originAddress: { ...packageForm.originAddress, country: e.target.value } })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: Brasil"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade de Destino</label>
                                        <input
                                            type="text"
                                            required
                                            value={packageForm.destinationAddress.city}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setPackageForm({ ...packageForm, destinationAddress: { ...packageForm.destinationAddress, city: newValue } });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: Rio de Janeiro"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">País de Destino</label>
                                        <input
                                            type="text"
                                            required
                                            value={packageForm.destinationAddress.country}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setPackageForm({ ...packageForm, destinationAddress: { ...packageForm.destinationAddress, country: newValue } });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: Brasil"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload de Imagem</label>
                                    {/* Exibe a imagem atual do pacote, se houver */}
                                    {packageForm && packageForm.image && (
                                        <div className="mb-3">
                                            <span className="block text-xs text-gray-500 mb-1">Imagem atual:</span>
                                            <img
                                                src={URL.createObjectURL(packageForm.image)}
                                                alt="Imagem atual do pacote"
                                                className="w-32 h-32 object-cover rounded border"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setPackageForm({ ...packageForm, image: e.target.files?.[0] || null })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {packageForm.image && (
                                        <p className="mt-1 text-sm text-gray-500">Arquivo selecionado: {packageForm.image.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"> {/* Aumenta o espaço acima desta seção */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
                                        <input
                                            type="text"
                                            required
                                            value={packageForm.duration}
                                            onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Máx. Pessoas</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={packageForm.maxPeople}
                                            onChange={(e) => setPackageForm({ ...packageForm, maxPeople: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Veículo</label>
                                        <select
                                            required
                                            value={packageForm.vehicleType}
                                            onChange={(e) => setPackageForm({ ...packageForm, vehicleType: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Selecione o veículo</option>
                                            {vehicleTypes.map((vehicle) => (
                                                <option key={vehicle} value={vehicle}>
                                                    {vehicle}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço Original</label>
                                        <input
                                            type="text"
                                            required
                                            value={packageForm.originalPrice}
                                            onChange={(e) => setPackageForm({ ...packageForm, originalPrice: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: R$ 1.999,99"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Taxa do Pacote</label>
                                        <input
                                            type="text"
                                            required
                                            value={packageForm.packageTax}
                                            onChange={(e) => setPackageForm({ ...packageForm, packageTax: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: R$ 150,00"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="w-full space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Porcentagem do Cupom de Desconto (%)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                step={1}
                                                value={packageForm.discountValue}
                                                onChange={(e) => setPackageForm({ ...packageForm, discountValue: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Digite a porcentagem do cupom"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Código do Cupom</label>
                                            <input
                                                type="text"
                                                value={packageForm.cupomDiscount}
                                                onChange={(e) => setPackageForm({ ...packageForm, cupomDiscount: e.target.value.toUpperCase() })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Ex: CARNAVAL10"
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        {/* Espaço vazio para manter o layout */}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 mb-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={packageForm.isActive}
                                            onChange={(e) => setPackageForm({ ...packageForm, isActive: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900">Pacote Ativo</span>
                                    </label>
                                </div>


                            </form>
                        ) : (
                            <form id="user-form" onSubmit={handleUserSubmit} className="space-y-10"> {/* Aumentado de 8 para 10 para mais espaço vertical */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nome e Sobrenome */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Aumentado mb-1 para mb-2 */}
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={userForm.firstName}
                                            onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: João"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Aumentado mb-1 para mb-2 */}
                                            Sobrenome
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={userForm.lastName}
                                            onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: Silva"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={userForm.email}
                                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="joao@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Telefone e CPF */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                        <input
                                            type="tel"
                                            required
                                            value={userForm.phone}
                                            onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="(11) 99999-9999"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                                        <input
                                            type="text"
                                            required
                                            value={userForm.documentNumber}
                                            onChange={(e) => setUserForm({ ...userForm, documentNumber: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="000.000.000-00"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Data de Nascimento e Função */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                                        <input
                                            type="date"
                                            required
                                            value={userForm.birthDate}
                                            onChange={(e) => setUserForm({ ...userForm, birthDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
                                        <select
                                            value={userForm.role}
                                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Administrador">Administrador</option>
                                            <option value="Suporte">Suporte</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-6">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={userForm.isActive}
                                            onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900">Usuário Ativo</span>
                                    </label>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Footer Fixo */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form={modalType === "pacotes" ? "package-form" : "user-form"}
                                className="flex-1 px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
                                style={{ backgroundColor: PRIMARY_COLOR }}
                            >
                                {modalType === "pacotes" ? "Criar Pacote" : "Criar Usuário Adm"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const renderEditModal = () => {
        if (!isEditModalOpen || !editingPackage) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* Overlay com gradiente */}
                <div
                    className="fixed inset-0 bg-opacity-80"
                    onClick={closeEditPackageModal}
                    style={{
                        background: MODAL_OVERLAY_GRADIENT
                    }}
                />

                {/* Container do Modal */}
                <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 my-8">
                    {/* Header Fixo */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                Editar Pacote: {editingPackage.name}
                            </h2>
                            <button
                                onClick={closeEditPackageModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Área com Scroll */}
                    <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <form id="package-form" onSubmit={handlePackageSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Pacote</label>
                                <input
                                    type="text"
                                    required
                                    value={editPackageForm.title}
                                    onChange={(e) => setEditPackageForm({ ...editPackageForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    required
                                    value={editPackageForm.description}
                                    onChange={(e) => setEditPackageForm({ ...editPackageForm, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Descrição detalhada do pacote..."
                                />
                            </div>

                            {/* Novo campo: Tipo de Pacote */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pacote</label>
                                <select
                                    required
                                    value={editPackageForm.packageType}
                                    onChange={(e) => setEditPackageForm({
                                        ...editPackageForm,
                                        packageType: e.target.value as "fixed" | "seasonal" | "recurring"
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="fixed">Data Fixa</option>
                                    <option value="seasonal">Sazonal - 2x ao ano</option>
                                    <option value="recurring">Recorrente - O ano todo</option>
                                </select>
                            </div>

                            {/* Campos condicionais baseados no tipo de pacote */}
                            {editPackageForm.packageType === "fixed" && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="text-sm font-medium text-blue-900 mb-3">Configuração de Data Fixa</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                                        <input
                                            type="date"
                                            required
                                            value={editPackageForm.fixedStartDate}
                                            onChange={(e) => setEditPackageForm({ ...editPackageForm, fixedStartDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {packageForm.packageType === "seasonal" && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="text-sm font-medium text-green-900 mb-3">Configuração Sazonal (2 períodos por ano)</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">1º Período</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Data de Início</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={editPackageForm.seasonalPeriods[0]?.startDate || ""}
                                                        onChange={(e) => {
                                                            const newPeriods = [...editPackageForm.seasonalPeriods];
                                                            newPeriods[0] = { ...newPeriods[0], startDate: e.target.value };
                                                            setEditPackageForm({ ...editPackageForm, seasonalPeriods: newPeriods });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Data de Fim</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={editPackageForm.seasonalPeriods[0]?.endDate || ""}
                                                        onChange={(e) => {
                                                            const newPeriods = [...editPackageForm.seasonalPeriods];
                                                            newPeriods[0] = { ...newPeriods[0], endDate: e.target.value };
                                                            setEditPackageForm({ ...editPackageForm, seasonalPeriods: newPeriods });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">2º Período</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Data de Início</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={editPackageForm.seasonalPeriods[1]?.startDate || ""}
                                                        onChange={(e) => {
                                                            const newPeriods = [...editPackageForm.seasonalPeriods];
                                                            newPeriods[1] = { ...newPeriods[1], startDate: e.target.value };
                                                            setEditPackageForm({ ...editPackageForm, seasonalPeriods: newPeriods });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Data de Fim</label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={editPackageForm.seasonalPeriods[1]?.endDate || ""}
                                                        onChange={(e) => {
                                                            const newPeriods = [...editPackageForm.seasonalPeriods];
                                                            newPeriods[1] = { ...newPeriods[1], endDate: e.target.value };
                                                            setEditPackageForm({ ...editPackageForm, seasonalPeriods: newPeriods });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {packageForm.packageType === "recurring" && (
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                    <h4 className="text-sm font-medium text-purple-900 mb-3">Configuração Recorrente</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                                            <input
                                                type="date"
                                                required
                                                value={editPackageForm.recurrenceStartDate}
                                                onChange={(e) => setEditPackageForm({ ...editPackageForm, recurrenceStartDate: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
                                            <input
                                                type="date"
                                                required
                                                value={editPackageForm.recurrenceEndDate}
                                                onChange={(e) => setEditPackageForm({ ...editPackageForm, recurrenceEndDate: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo (dias)</label>
                                            <select
                                                required
                                                value={editPackageForm.intervalDays}
                                                onChange={(e) => setEditPackageForm({ ...editPackageForm, intervalDays: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Selecione</option>
                                                <option value="7">A cada 7 dias</option>
                                                <option value="14">A cada 14 dias</option>
                                                <option value="15">A cada 15 dias</option>
                                                <option value="30">A cada 30 dias</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade de Origem</label>
                                    <input
                                        type="text"
                                        required
                                        value={editPackageForm.originAddress.city}
                                        onChange={(e) => setEditPackageForm({ ...editPackageForm, originAddress: { ...editPackageForm.originAddress, city: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: São Paulo"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">País de Origem</label>
                                    <input
                                        type="text"
                                        required
                                        value={editPackageForm.originAddress.country}
                                        onChange={(e) => setEditPackageForm({ ...editPackageForm, originAddress: { ...editPackageForm.originAddress, country: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Brasil"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade de Destino</label>
                                    <input
                                        type="text"
                                        required
                                        value={editPackageForm.destinationAddress.city}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setEditPackageForm({ ...editPackageForm, destinationAddress: { ...editPackageForm.destinationAddress, city: newValue } });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Rio de Janeiro"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">País de Destino</label>
                                    <input
                                        type="text"
                                        required
                                        value={editPackageForm.destinationAddress.country}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setEditPackageForm({ ...editPackageForm, destinationAddress: { ...editPackageForm.destinationAddress, country: newValue } });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Brasil"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload de Imagem</label>
                                {/* Exibe a imagem atual do pacote, se houver */}
                                {editPackageForm && editPackageForm.image && (
                                    <div className="mb-3">
                                        <span className="block text-xs text-gray-500 mb-1">Imagem atual:</span>
                                        <img
                                            src={URL.createObjectURL(editPackageForm.image)}
                                            alt="Imagem atual do pacote"
                                            className="w-32 h-32 object-cover rounded border"
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditPackageForm({ ...editPackageForm, image: e.target.files?.[0] || null })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {editPackageForm.image && (
                                    <p className="mt-1 text-sm text-gray-500">Arquivo selecionado: {editPackageForm.image.name}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"> {/* Aumenta o espaço acima desta seção */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
                                    <input
                                        type="text"
                                        required
                                        value={editPackageForm.duration}
                                        onChange={(e) => setEditPackageForm({ ...editPackageForm, duration: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Máx. Pessoas</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={editPackageForm.maxPeople}
                                        onChange={(e) => setEditPackageForm({ ...editPackageForm, maxPeople: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Veículo</label>
                                    <select
                                        required
                                        value={editPackageForm.vehicleType}
                                        onChange={(e) => setEditPackageForm({ ...editPackageForm, vehicleType: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Selecione o veículo</option>
                                        {vehicleTypes.map((vehicle) => (
                                            <option key={vehicle} value={vehicle}>
                                                {vehicle}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Original</label>
                                    <input
                                        type="text"
                                        required
                                        value={editPackageForm.originalPrice}
                                        onChange={(e) => setEditPackageForm({ ...editPackageForm, originalPrice: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: R$ 1.999,99"
                                    />
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Taxa do Pacote</label>
                                    <input
                                        type="text"
                                        required
                                        value={editPackageForm.packageTax}
                                        onChange={(e) => setEditPackageForm({ ...editPackageForm, packageTax: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: R$ 150,00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="w-full space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Porcentagem do Cupom de Desconto (%)</label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            step={1}
                                            value={editPackageForm.discountValue}
                                            onChange={(e) => setEditPackageForm({ ...editPackageForm, discountValue: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Digite a porcentagem do cupom"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Código do Cupom</label>
                                        <input
                                            type="text"
                                            value={editPackageForm.cupomDiscount}
                                            onChange={(e) => setEditPackageForm({ ...editPackageForm, cupomDiscount: e.target.value.toUpperCase() })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: CARNAVAL10"
                                        />
                                    </div>
                                </div>

                                <div className="w-full">
                                    {/* Espaço vazio para manter o layout */}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 mb-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editPackageForm.isActive}
                                        onChange={(e) => setEditPackageForm({ ...editPackageForm, isActive: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900">Pacote Ativo</span>
                                </label>
                            </div>


                        </form>
                    </div>

                    {/* Footer Fixo */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={closeEditPackageModal}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="edit-package-form"
                                className="flex-1 px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
                                style={{ backgroundColor: PRIMARY_COLOR }}
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Form states
    // Estados para criação e edição de pacotes
    const [editingPackage, setEditingPackage] = useState<TableData | null>(null);
    const [packageForm, setPackageForm] = useState<PackageFormData>({
        title: "",
        description: "",
        originAddress: { city: "", country: "" },
        destinationAddress: { city: "", country: "" },
        image: null,
        duration: "",
        maxPeople: "",
        vehicleType: "",
        originalPrice: "",
        isActive: true,
        // Novos campos
        packageType: "fixed",
        packageTax: "",
        cupomDiscount: "",
        discountValue: "",
        // Campos para pacote com data fixa
        fixedStartDate: "",
        // Campos para pacote sazonal
        seasonalPeriods: [
            { startDate: "", endDate: "", isAvailable: true },
            { startDate: "", endDate: "", isAvailable: true }
        ],
        // Campos para pacote recorrente
        recurrenceStartDate: "",
        recurrenceEndDate: "",
        intervalDays: ""
    })
    const [editPackageForm, setEditPackageForm] = useState<PackageFormData>({
        title: "",
        description: "",
        originAddress: { city: "", country: "" },
        destinationAddress: { city: "", country: "" },
        image: null,
        imageUrl: "",
        duration: "",
        maxPeople: "",
        vehicleType: "",
        originalPrice: "",
        isActive: true,
        // Novos campos
        packageType: "fixed",
        packageTax: "",
        cupomDiscount: "",
        discountValue: "",
        // Campos para pacote com data fixa
        fixedStartDate: "",
        // Campos para pacote sazonal
        seasonalPeriods: [
            { startDate: "", endDate: "", isAvailable: true },
            { startDate: "", endDate: "", isAvailable: true }
        ],
        // Campos para pacote recorrente
        recurrenceStartDate: "",
        recurrenceEndDate: "",
        intervalDays: ""
    });
    const handlePackageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validações básicas
        if (!packageForm.title.trim()) {
            alert("Por favor, insira um título para o pacote");
            return;
        }
        if (!packageForm.description.trim()) {
            alert("Por favor, insira uma descrição para o pacote");
            return;
        }
        // Validação baseada no tipo de pacote
        if (packageForm.packageType === "fixed" && !packageForm.fixedStartDate) {
            alert("Por favor, defina a data de início para o pacote de data fixa");
            return;
        }
        if (packageForm.packageType === "seasonal") {
            const period1Valid = packageForm.seasonalPeriods[0]?.startDate && packageForm.seasonalPeriods[0]?.endDate;
            const period2Valid = packageForm.seasonalPeriods[1]?.startDate && packageForm.seasonalPeriods[1]?.endDate;
            if (!period1Valid || !period2Valid) {
                alert("Por favor, defina ambos os períodos sazonais");
                return;
            }
        }
        if (packageForm.packageType === "recurring") {
            if (!packageForm.recurrenceStartDate || !packageForm.recurrenceEndDate || !packageForm.intervalDays) {
                alert("Por favor, defina o período e intervalo para o pacote recorrente");
                return;
            }
        }

        // Montar o objeto conforme esperado pela API
        let packageSchedule: any = {};
        if (packageForm.packageType === "fixed") {
            packageSchedule = {
                startDate: packageForm.fixedStartDate,
                isFixed: true,
                isAvailable: true
            };
        } else if (packageForm.packageType === "seasonal") {
            // Envia o primeiro período como exemplo
            packageSchedule = {
                startDate: packageForm.seasonalPeriods[0].startDate,
                endDate: packageForm.seasonalPeriods[0].endDate,
                isFixed: false,
                isAvailable: packageForm.seasonalPeriods[0].isAvailable
            };
        } else if (packageForm.packageType === "recurring") {
            packageSchedule = {
                startDate: packageForm.recurrenceStartDate,
                endDate: packageForm.recurrenceEndDate,
                isFixed: false,
                isAvailable: true
            };
        }


        const formData = new FormData();
        formData.append("title", packageForm.title.trim());
        formData.append("description", packageForm.description.trim());
        if (packageForm.image) {
            formData.append("image", packageForm.image); // arquivo real
        }
        formData.append("vehicleType", packageForm.vehicleType);
        formData.append("duration", packageForm.duration);
        formData.append("maxPeople", packageForm.maxPeople);
        formData.append("originalPrice", packageForm.originalPrice.replace(/[^\d.,]/g, '').replace(',', '.'));
        formData.append("price", packageForm.originalPrice.replace(/[^\d.,]/g, '').replace(',', '.'));
        formData.append("packageTax", packageForm.packageTax.replace(/[^\d.,]/g, '').replace(',', '.'));
        formData.append("cupomDiscount", packageForm.cupomDiscount.trim());
        formData.append("discountValue", packageForm.discountValue);
        formData.append("manualDiscountValue", "0");
        formData.append("originAddress.City", packageForm.originAddress.city);
        formData.append("originAddress.Country", packageForm.originAddress.country);
        formData.append("destinationAddress.City", packageForm.destinationAddress.city);
        formData.append("destinationAddress.Country", packageForm.destinationAddress.country);
        formData.append("userId", "2");

        formData.append("packageSchedule", JSON.stringify(packageSchedule));

        try {
            const axios = (await import("axios")).default;
            const response = await axios.post("http://localhost:5028/api/TravelPackage/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            alert(`Pacote "${packageForm.title}" criado com sucesso!`);
            closeModal();
        } catch (error: any) {
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            alert("Erro ao criar pacote. Verifique os dados e tente novamente.");
            console.error(error);
        }
    }
    const handleEditPackage = (packageItem: TableData) => {
        const selectedPackage = getPackageById(packageItem.id);
        if (!selectedPackage) return;

        setEditingPackage(selectedPackage);

        // Pré-preencher o formulário com os dados do pacote selecionado
        // Como os dados da tabela são limitados, vamos simular dados mais completos
        setEditPackageForm({
            title: selectedPackage.title || "",
            description: selectedPackage.description || "",
            originAddress: {
                city: selectedPackage.originCity || "",
                country: selectedPackage.originCountry || ""
            },
            destinationAddress: {
                city: selectedPackage.destinationCity || "",
                country: selectedPackage.destinationCountry || ""
            },
            image: null,
            imageUrl: selectedPackage.imageUrl || "",
            duration: selectedPackage.duration || "",
            maxPeople: selectedPackage.maxPeople || "",
            vehicleType: selectedPackage.vehicleType || "",
            originalPrice: selectedPackage.originalPrice || "",
            isActive: selectedPackage.isActive || "",
            // Novos campos
            packageType: selectedPackage.duration || "",
            packageTax: selectedPackage.packageTax || "",
            cupomDiscount: selectedPackage.cupomDiscount || "",
            discountValue: selectedPackage.discountValue || "",
            // Campos para pacote com data fixa
            fixedStartDate: selectedPackage.fixedStartDate || "",
            // Campos para pacote sazonal
            seasonalPeriods: [
                { startDate: "ainda não existe na API", endDate: "ainda não existe na API", isAvailable: true },
                { startDate: "ainda não existe na API", endDate: "ainda não existe na API", isAvailable: true }
            ],
            // Campos para pacote recorrente
            recurrenceStartDate: "ainda não existe na API",
            recurrenceEndDate: "ainda não existe na API",
            intervalDays: "ainda não existe na API"
        });

        setIsEditModalOpen(true);
    };
    const closeEditPackageModal = () => {
        setIsEditModalOpen(false)
        setEditingPackage(null)
        // Limpar o formulário de edição
        setEditPackageForm({
            title: "",
            description: "",
            originAddress: { city: "", country: "" },
            destinationAddress: { city: "", country: "" },
            image: null,
            duration: "",
            maxPeople: "",
            vehicleType: "",
            originalPrice: "",
            isActive: true,
            // Novos campos
            packageType: "fixed",
            packageTax: "",
            cupomDiscount: "",
            discountValue: "",
            // Campos para pacote com data fixa
            fixedStartDate: "",
            // Campos para pacote sazonal
            seasonalPeriods: [
                { startDate: "", endDate: "", isAvailable: true },
                { startDate: "", endDate: "", isAvailable: true }
            ],
            // Campos para pacote recorrente
            recurrenceStartDate: "",
            recurrenceEndDate: "",
            intervalDays: ""
        })
    }
    // Função para lidar com o envio do formulário de edição
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingPackage) return;

        // Monta o objeto conforme esperado pela API
        const formData = new FormData();
        formData.append("travelPackageId", String(editingPackage.id));
        formData.append("title", editPackageForm.title);
        formData.append("description", editPackageForm.description);
        if (editPackageForm.image) {
            formData.append("imageFile", editPackageForm.image); // arquivo real
        }
        formData.append("vehicleType", editPackageForm.vehicleType);
        formData.append("duration", editPackageForm.duration);
        formData.append("maxPeople", editPackageForm.maxPeople);
        formData.append("originalPrice", editPackageForm.originalPrice.replace(/[^\d.,]/g, '').replace(',', '.'));
        formData.append("price", editPackageForm.originalPrice.replace(/[^\d.,]/g, '').replace(',', '.'));
        formData.append("packageTax", editPackageForm.packageTax.replace(/[^\d.,]/g, '').replace(',', '.'));
        formData.append("cupomDiscount", editPackageForm.cupomDiscount);
        formData.append("discountValue", editPackageForm.discountValue);
        formData.append("manualDiscountValue", "0");
        formData.append("originCity", editPackageForm.originAddress.city);
        formData.append("originCountry", editPackageForm.originAddress.country);
        formData.append("destinationCity", editPackageForm.destinationAddress.city);
        formData.append("destinationCountry", editPackageForm.destinationAddress.country);

        const packageSchedule = {
            startDate: editPackageForm.fixedStartDate,
            endDate: null,
            duration: 0,
            isFixed: true,
            isAvailable: editPackageForm.isActive
        };
        formData.append("packageSchedule", JSON.stringify(packageSchedule));


        try {
            const axios = (await import("axios")).default;
            await axios.put("http://localhost:5028/api/TravelPackage/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("Pacote atualizado com sucesso!");
            closeEditPackageModal();
            fetchPackages();
        } catch (error) {
            alert("Erro ao atualizar pacote.");
            console.error(error);
        }
    };

    // Estados para edição de usuários
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [userForm, setUserForm] = useState<UserFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        documentNumber: "",
        birthDate: "",
        role: "Cliente",
        isActive: true
    })
    const [editingUser, setEditingUser] = useState<TableData | null>(null);
    const [editUserForm, setEditUserForm] = useState<UserFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        documentNumber: "",
        birthDate: "",
        role: "Cliente",
        isActive: true
    });
    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Novo usuário:", userForm)
        closeModal()
    }
    const handleEditUser = (userItem: TableData) => {

        const selectedUser = getUserById(userItem.id);
        if (!selectedUser) return;

        setEditingUser(userItem);

        setEditUserForm({
            firstName: selectedUser.firstName || "",
            lastName: selectedUser.lastName || "",
            email: selectedUser.email || "",
            phone: selectedUser.phone || "",
            documentNumber: selectedUser.documentNumber || "",
            birthDate: selectedUser.birthDate ? selectedUser.birthDate.split("T")[0] : "",
            role: selectedUser.role || "",
            isActive: selectedUser.isActive,
        });

        setIsEditUserModalOpen(true);
    };
    const closeEditUserModal = () => {
        setIsEditUserModalOpen(false)
        setEditingUser(null)
        // Limpar o formulário de edição de usuário
        setEditUserForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            documentNumber: "",
            birthDate: "",
            role: "",
            isActive: true
        })
    }
    const renderEditUserModal = () => {
        if (!isEditUserModalOpen || !editingUser) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* Overlay com gradiente */}
                <div
                    className="fixed inset-0 bg-opacity-80"
                    onClick={closeEditUserModal}
                    style={{
                        background: MODAL_OVERLAY_GRADIENT
                    }}
                />

                {/* Container do Modal */}
                <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 my-8">
                    {/* Header Fixo */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                Editar Usuário: {editingUser.name}
                            </h2>
                            <button
                                onClick={closeEditUserModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Área com Scroll */}
                    <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <form id="edit-user-form" onSubmit={handleEditUserSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nome e Sobrenome */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editUserForm.firstName}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: João"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sobrenome
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editUserForm.lastName}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, lastName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Silva"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={editUserForm.email}
                                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="joao@email.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Telefone e CPF */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <input
                                        type="tel"
                                        required
                                        value={editUserForm.phone}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                                    <input
                                        type="text"
                                        required
                                        value={editUserForm.documentNumber}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, documentNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Data de Nascimento e Função */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        required
                                        value={editUserForm.birthDate}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, birthDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
                                    <select
                                        value={editUserForm.role}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Administrador">Administrador</option>
                                        <option value="Suporte">Suporte</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-6">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editUserForm.isActive}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, isActive: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900">Usuário Ativo</span>
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Footer Fixo */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={closeEditUserModal}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="edit-user-form"
                                className="flex-1 px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
                                style={{ backgroundColor: PRIMARY_COLOR }}
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const handleEditUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingUser) return;

        // Aqui você implementaria a lógica para salvar as alterações do usuário
        const updatedUserData = {
            userId: editingUser.id,
            email: editUserForm.email,
            firstName: editUserForm.firstName,
            lastName: editUserForm.lastName,
            birthDate: editUserForm.birthDate,
            password: "string" // Se não for alterar, envie um valor padrão ou o atual
        };

        try {
            const axios = (await import("axios")).default;
            await axios.put(`http://localhost:5028/api/User/${editingUser.id}`, updatedUserData);
            alert("Usuário atualizado com sucesso!");
            closeEditUserModal();
            fetchClients(); // Atualiza a tabela de clientes após edição
        } catch (error) {
            alert("Erro ao atualizar usuário.");
            console.error(error);
        }
    };

    // Estados para edição de afiliados
    const [isEditAffiliateModalOpen, setIsEditAffiliateModalOpen] = useState(false);
    const [editingAffiliate, setEditingAffiliate] = useState<TableData | null>(null);
    const [editAffiliateForm, setEditAffiliateForm] = useState<AffiliateFormData>({
        corporateName: "",
        tradeName: "",
        cnpj: "",
        stateRegistration: "",
        phone: "",
        email: "",
        cep: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "",
        isActive: true
    });
    const handleViewAffiliate = (affiliateItem: TableData) => {
        const selectedAffiliate = getAffiliateById(affiliateItem.id);
        if (!selectedAffiliate) return;

        setEditingAffiliate(selectedAffiliate);

        setEditAffiliateForm({
            corporateName: selectedAffiliate.name || "",
            tradeName: selectedAffiliate.companyName || "",
            cnpj: selectedAffiliate.cnpj || "",
            stateRegistration: selectedAffiliate.stateRegistration || "",
            phone: selectedAffiliate.phone || "",
            email: selectedAffiliate.email || "",
            cep: selectedAffiliate.address?.zipCode || "",
            street: selectedAffiliate.address?.streetName || "",
            number: selectedAffiliate.address?.addressNumber || "",
            neighborhood: selectedAffiliate.address?.neighborhood || "",
            city: selectedAffiliate.address?.city || "",
            state: selectedAffiliate.address?.state || "",
            country: selectedAffiliate.address?.country || "",
            isActive: selectedAffiliate.isActive,
        });

        setIsEditAffiliateModalOpen(true);
    };
    const closeEditAffiliateModal = () => {
        setIsEditAffiliateModalOpen(false)
        setEditingAffiliate(null)
        // Limpar o formulário de edição de afiliado
        setEditAffiliateForm({
            corporateName: "",
            tradeName: "",
            cnpj: "",
            stateRegistration: "",
            phone: "",
            email: "",
            cep: "",
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            country: "",
            isActive: true
        })
    }
    const renderEditAffiliateModal = () => {
        if (!isEditAffiliateModalOpen || !editingAffiliate) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* Overlay com gradiente */}
                <div
                    className="fixed inset-0 bg-opacity-80"
                    onClick={closeEditAffiliateModal}
                    style={{
                        background: MODAL_OVERLAY_GRADIENT
                    }}
                />

                {/* Container do Modal */}
                <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 my-8">
                    {/* Header Fixo */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                Visualizar Afiliado: {editingAffiliate.name}
                            </h2>
                            <button
                                onClick={closeEditAffiliateModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Área com Scroll */}
                    <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.corporateName}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Fantasia</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.tradeName}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.cnpj}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Inscrição Estadual</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.stateRegistration}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <input
                                        type="tel"
                                        value={editAffiliateForm.phone}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email de Acesso</label>
                                <input
                                    type="email"
                                    value={editAffiliateForm.email}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    style={{ color: "#003194" }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.cep}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.street}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.number}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.neighborhood}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.city}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.state}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                                    <input
                                        type="text"
                                        value={editAffiliateForm.country}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-6">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-700">Status: </span>
                                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${editAffiliateForm.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {editAffiliateForm.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Fixo */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={closeEditAffiliateModal}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Estados para edição de hotéis
    const [isEditHotelModalOpen, setIsEditHotelModalOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState<TableData | null>(null);
    const [editHotelForm, setEditHotelForm] = useState<HotelFormData>({
        name: "",
        description: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        cep: "",
        state: "",
        country: "",
        phone: "",
        email: "",
        isActive: true,
        star: 0
    });
    const handleViewHotel = (item: TableData) => {

        const hotel = getHotelById(item.id);
        if (!hotel) return;

        setEditingHotel(hotel);

        setEditHotelForm({
            name: hotel.name,
            description: hotel.description || "",
            street: hotel.address?.streetName || "",
            number: hotel.address?.addressNumber || "",
            neighborhood: hotel.address?.neighborhood || "",
            city: hotel.address?.city || "",
            cep: hotel.address?.zipCode || "",
            state: hotel.address?.state || "",
            country: hotel.address?.country || "",
            phone: hotel.contactNumber || "",
            email: hotel.affiliate?.email || "",
            isActive: hotel.isActive,
            star: hotel.star || 1
        });

        setIsEditHotelModalOpen(true);
    };
    const closeEditHotelModal = () => {
        setIsEditHotelModalOpen(false)
        setEditingHotel(null)
        // Limpar o formulário de edição de hotel
        setEditHotelForm({
            name: "",
            description: "",
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            cep: "",
            state: "",
            country: "",
            phone: "",
            email: "",
            isActive: true,
            star: 1
        })
    }
    // Modal de edição
    const renderEditHotelModal = () => {
        if (!isEditHotelModalOpen || !editingHotel) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* Overlay com gradiente */}
                <div
                    className="fixed inset-0 bg-opacity-80"
                    onClick={closeEditHotelModal}
                    style={{
                        background: MODAL_OVERLAY_GRADIENT
                    }}
                />

                {/* Container do Modal */}
                <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 my-8">
                    {/* Header Fixo */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                Visualizar Hotel: {editingHotel.name}
                            </h2>
                            <button
                                onClick={closeEditHotelModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Área com Scroll */}
                    <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Hotel</label>
                                <input
                                    type="text"
                                    value={editHotelForm.name}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    style={{ color: "#003194" }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                                <textarea
                                    value={editHotelForm.description}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    style={{ color: "#003194" }}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                                    <input
                                        type="text"
                                        value={editHotelForm.cep}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                                    <input
                                        type="text"
                                        value={editHotelForm.street}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                                    <input
                                        type="text"
                                        value={editHotelForm.number}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                                    <input
                                        type="text"
                                        value={editHotelForm.neighborhood}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                                    <input
                                        type="text"
                                        value={editHotelForm.city}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    <input
                                        type="text"
                                        value={editHotelForm.state}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                                    <input
                                        type="text"
                                        value={editHotelForm.country}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <input
                                        type="tel"
                                        value={editHotelForm.phone}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                                    <input
                                        type="email"
                                        value={editHotelForm.email}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estrelas</label>
                                    <input
                                        value={editHotelForm.star}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-6">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-700">Status: </span>
                                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${editHotelForm.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {editHotelForm.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Fixo */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={closeEditHotelModal}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Estados para edição de clientes
    const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<TableData | null>(null);
    const [editClientForm, setEditClientForm] = useState<ClientFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        documentNumber: "",
        birthDate: "",
        isActive: true
    });
    const handleViewClient = (clientItem: TableData) => {
        const selectedClient = getClientById(clientItem.id);
        if (!selectedClient) return;

        setEditingClient(selectedClient);

        setEditClientForm({
            firstName: selectedClient.firstName || "",
            lastName: selectedClient.lastName || "",
            email: selectedClient.email || "",
            phone: selectedClient.phone || "",
            documentNumber: selectedClient.documentNumber || "",
            birthDate: selectedClient.birthDate ? selectedClient.birthDate.split("T")[0] : "",
            isActive: selectedClient.isActive,
        });

        setIsEditClientModalOpen(true);
    };
    const closeEditClientModal = () => {
        setIsEditClientModalOpen(false)
        setEditingClient(null)
        // Limpar o formulário de edição de cliente
        setEditClientForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            documentNumber: "",
            birthDate: "",
            isActive: true
        })
    }
    // Modal de edição
    const renderEditClientModal = () => {
        if (!isEditClientModalOpen || !editingClient) return null;
        console.log("Rendering Edit Client Modal", editingClient);


        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* Overlay com gradiente */}
                <div
                    className="fixed inset-0 bg-opacity-80"
                    onClick={closeEditClientModal}
                    style={{
                        background: MODAL_OVERLAY_GRADIENT
                    }}
                />

                {/* Container do Modal */}
                <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 my-8">
                    {/* Header Fixo */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                Visualizar Cliente: {editingClient.name}
                            </h2>
                            <button
                                onClick={closeEditClientModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Área com Scroll */}
                    <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                    <input
                                        type="text"
                                        value={editClientForm.firstName}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sobrenome</label>
                                    <input
                                        type="text"
                                        value={editClientForm.lastName}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editClientForm.email}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    style={{ color: "#003194" }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <input
                                        type="tel"
                                        value={editClientForm.phone}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF ou Passaporte</label>
                                    <input
                                        type="text"
                                        value={editClientForm.documentNumber}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        style={{ color: "#003194" }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Aniversário</label>
                                <input
                                    type="date"
                                    value={editClientForm.birthDate}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    style={{ color: "#003194" }}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Status:</label>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${editClientForm.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {editClientForm.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Fixo */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={closeEditClientModal}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const menuItems: MenuItem[] = [
        { id: "dashboard", label: "Dashboard", icon: <FaChartBar style={{ color: "white", fill: "white" }} /> },
        { id: "pacotes", label: "Pacotes", icon: <FaBox style={{ color: "white", fill: "white" }} /> },
        { id: "afiliados", label: "Afiliados", icon: <FaUserTie style={{ color: "white", fill: "white" }} /> },
        { id: "hoteis", label: "Hotéis", icon: <FaHotel style={{ color: "white", fill: "white" }} /> },
        { id: "clientes", label: "Clientes", icon: <FaUsers style={{ color: "white", fill: "white" }} /> },
        { id: "usuarios", label: "Usuários Adm", icon: <FaUsers style={{ color: "white", fill: "white" }} /> },
    ]

    const vehicleTypes = [
        "Ônibus",
        "Avião",
        "Trem",
        "Navio"
    ]

    // Renderiza os dashboards principais
    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 -mt-3">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col justify-between min-h-[80px]">
                            <p className="text-sm text-gray-600 mb-2">Total de Pacotes Vendidos</p>
                            <p className="text-2xl font-bold text-gray-900 mb-1">1,234</p>
                            <p className="text-sm text-green-600">+12.5% vs mês anterior</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaMoneyBill className="text-green-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col justify-between min-h-[80px]">
                            <p className="text-sm text-gray-600 mb-2">Receita Total</p>
                            <p className="text-2xl font-bold text-gray-900 mb-1">R$ 89.2k</p>
                            <p className="text-sm text-green-600">+8.2% vs mês anterior</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaDollarSign className="text-green-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col justify-between min-h-[80px]">
                            <p className="text-sm text-gray-600 mb-2">Pacotes Ativos</p>
                            <p className="text-2xl font-bold text-gray-900 mb-1">24</p>
                            <p className="text-sm text-green-600">+2 novos este mês</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaBolt className="text-xl" style={{ color: "#F77E28" }} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col justify-between min-h-[80px]">
                            <p className="text-sm text-gray-600 mb-2">Pacotes em Promoção</p>
                            <p className="text-2xl font-bold text-gray-900 mb-1">15</p>
                            <p className="text-sm text-green-600">+5.1% vs mês anterior</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaShoppingCart className="text-purple-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-5">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Quantidade de pacotes comprados</h3>
                    </div>
                    <div className="h-60 relative">
                        <div className="h-full flex items-end justify-between space-x-4">
                            {[45, 52, 38, 61, 55, 67].map((height, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end mx-1">
                                    <div
                                        className="w-full rounded-t min-h-2 transition-all duration-300 hover:opacity-80"
                                        style={{ height: `${height}%`, backgroundColor: "#F77E28" }}
                                        title={`${["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][index]}: ${height} pacotes`}
                                    ></div>
                                    <span className="text-xs text-gray-500 mt-2 font-medium">
                                        {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Ganhos Mensais</h3>
                        <span className="text-sm text-gray-500">Em R$</span>
                    </div>
                    <div className="h-64 relative">
                        {/* SVG Chart Container */}
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Grid lines for better visualization */}
                            <defs>
                                <pattern id="grid" width="16.67" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 16.67 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />

                            {/* Line connecting all points */}
                            <polyline
                                fill="none"
                                stroke="#F77E28"
                                strokeWidth="1"
                                vectorEffect="non-scaling-stroke"
                                points="8.33,74 25,59 41.67,69 58.33,49 75,54 91.67,39"
                            />
                        </svg>

                        {/* Data points positioned responsively */}
                        {[
                            { x: 8.33, y: 74, value: "R$ 15.2k", month: "Jan" },
                            { x: 25, y: 59, value: "R$ 28.5k", month: "Fev" },
                            { x: 41.67, y: 69, value: "R$ 22.1k", month: "Mar" },
                            { x: 58.33, y: 49, value: "R$ 35.8k", month: "Abr" },
                            { x: 75, y: 54, value: "R$ 31.2k", month: "Mai" },
                            { x: 91.67, y: 39, value: "R$ 42.6k", month: "Jun" },
                        ].map((point, index) => (
                            <div
                                key={index}
                                className="absolute cursor-pointer group z-10"
                                style={{
                                    left: `${point.x}%`,
                                    top: `${point.y}%`,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-sm group-hover:w-4 group-hover:h-4 transition-all duration-200"></div>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                    {point.month}: {point.value}
                                </div>
                            </div>
                        ))}

                        {/* Month labels at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
                            {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map((month) => (
                                <span key={month} className="text-center">{month}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Pacotes mais vendidos</h3>
                        <span className="text-sm text-gray-500">Hoje</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Pacote Luxo", percentage: 85 },
                            { name: "Pacote Econômico", percentage: 72 },
                            { name: "Pacote Familiar", percentage: 91 },
                            { name: "Pacote Romântico", percentage: 68 },
                        ].map((pacote, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1 mb-2">
                                    <span className="text-gray-700">{pacote.name}</span>
                                    <span className="text-gray-900 font-medium">{pacote.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                        className="h-2 rounded-full"
                                        style={{ width: `${pacote.percentage}%`, backgroundColor: PRIMARY_COLOR }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Reservas dos Pacotes</h3>
                    <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Base circle (cinza) */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="8"
                                />

                                {/* Confirmadas (verde) - 56.25% */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="8"
                                    strokeDasharray="251.2"
                                    strokeDashoffset="0"
                                />

                                {/* Pendentes (laranja) - 28.75% */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#F77E28"
                                    strokeWidth="8"
                                    strokeDasharray="251.2"
                                    strokeDashoffset="-141.3"  // 251.2 * 0.5625 (offset do verde)
                                />

                                {/* Canceladas (vermelho) - 15% */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#EF4444"
                                    strokeWidth="8"
                                    strokeDasharray="251.2"
                                    strokeDashoffset="-213.52"  // 251.2 * (0.5625 + 0.2875) (offset do verde + laranja)
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">Confirmadas</span>
                            </div>
                            <span className="text-sm font-medium">45</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#F77E28" }}></div>
                                <span className="text-sm text-gray-700">Pendentes</span>
                            </div>
                            <span className="text-sm font-medium">23</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">Canceladas</span>
                            </div>
                            <span className="text-sm font-medium">12</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // Estado para os dados das tabelas
    const renderTable = (tabId: string) => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <span className="text-lg font-medium text-gray-700">Carregando dados...</span>
                </div>
            );
        }

        const data =
            tabId === "pacotes"
                ? packagesTableData
                : tabId === "afiliados"
                    ? affiliatesTableData
                    : tabId === "hoteis"
                        ? hotelsTableData
                        : tabId === "clientes"
                            ? clientsTableData
                            : tabId === "usuarios"
                                ? usersTableData
                                : [];
        const tabLabels: Record<string, string> = {
            pacotes: "Pacotes",
            afiliados: "Afiliados",
            hoteis: "Hotéis",
            clientes: "Clientes",
            usuarios: "Usuários",
        }
        const tabsWithCreateButton = ["pacotes", "usuarios"]

        // Definir colunas específicas para cada tipo de tabela
        const getTableHeaders = () => {
            if (tabId === "pacotes") {
                return (
                    <tr>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Pacote</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor do Pacote</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vagas Restantes</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                );
            } else if (tabId === "afiliados") {
                return (
                    <tr>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razão Social</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                );
            } else if (tabId === "hoteis") {
                return (
                    <tr>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Hotel</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Afiliado</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                );
            } else if (tabId === "clientes") {
                return (
                    <tr>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                );
            } else if (tabId === "usuarios") {
                return (
                    <tr>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colaborador</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                );
            } else {
                return (
                    <tr>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                );
            }
        }; const getTableRow = (item: TableData) => {
            if (tabId === "pacotes") {
                return (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.status === "Ativo"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "Inativo"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                            >
                                {item.status}
                            </span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500 font-medium text-green-600">{item.value}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">
                            <span className={`font-medium ${item.remainingSlots && item.remainingSlots <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
                                {item.remainingSlots || 0} vagas
                            </span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-medium space-x-3">
                            <button
                                onClick={() => handleEditPackage(item)}
                                className="p-2 rounded hover:opacity-80"
                                style={{ color: "#003194", backgroundColor: "rgba(0, 49, 148, 0.1)" }}
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => handleToggleItemStatus(item, tabId)}
                                className={`p-2 rounded hover:opacity-80 ${item.status === "Ativo"
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-green-600 hover:bg-green-50"
                                    }`}
                                title={`Clique para ${item.status === "Ativo" ? "desativar" : "ativar"}`}
                            >
                                {item.status === "Ativo" ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                        </td>
                    </tr>
                );
            } else {
                return (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.status === "Ativo"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "Inativo"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                            >
                                {item.status}
                            </span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">{item.value}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-medium space-x-3">
                            <button
                                onClick={() => {
                                    if (tabId === "usuarios") {
                                        handleEditUser(item);
                                    } else if (tabId === "afiliados") {
                                        handleViewAffiliate(item);
                                    } else if (tabId === "hoteis") {
                                        handleViewHotel(item);
                                    } else if (tabId === "clientes") {
                                        handleViewClient(item);
                                    } else {
                                        handleEditPackage(item);
                                    }
                                }}
                                className="p-2 rounded hover:opacity-80"
                                style={{ color: "#003194", backgroundColor: "rgba(0, 49, 148, 0.1)" }}
                                title={tabId === "afiliados" || tabId === "hoteis" || tabId === "clientes" ? "Visualizar" : "Editar"}
                            >
                                {(tabId === "afiliados" || tabId === "hoteis" || tabId === "clientes") ? <FaEye /> : <FaEdit />}
                            </button>
                            <button
                                onClick={() => handleToggleItemStatus(item, tabId)}
                                className={`p-2 rounded hover:opacity-80 ${item.status === "Ativo"
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-green-600 hover:bg-green-50"
                                    }`}
                                title={`Clique para ${item.status === "Ativo" ? "desativar" : "ativar"}`}
                            >
                                {item.status === "Ativo" ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                        </td>
                    </tr>
                );
            }
        };

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{tabLabels[tabId]}</h2>
                    {/* Só mostra o botão se a aba atual está na lista de abas permitidas */}
                    {tabsWithCreateButton.includes(tabId) && (
                        <button
                            onClick={() => openModal(tabId as "pacotes" | "usuarios")}
                            className="bg-white px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2 mb-3 gap-2"
                            style={{ color: "#003194" }}
                        >
                            <FaPlus />
                            <span>Criar Novo</span>
                        </button>
                    )}
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            {getTableHeaders()}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item) => getTableRow(item))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    // USUÁRIOS ADMINS -> Carrega os dados da API e mapeia para o formato da tabela
    const [usersTableData, setUsersTableData] = useState<TableData[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);

    async function fetchUsers() {
        try {
            const axios = (await import("axios")).default;
            const response = await axios.get("http://localhost:5028/api/admin");
            setAllUsers(response.data);
            const mapped = response.data.map((user: any) => ({
                id: user.userId,
                name: `${user.firstName} ${user.lastName}`,
                status: user.isActive ? "Ativo" : "Inativo",
                date: user.createdAt ? user.createdAt.split("T")[0] : "",
                value: user.role === 2 ? "Administrador" : user.role === 3 ? "Suporte" : "Cliente"
            }));
            setUsersTableData(mapped);
        } catch (err) {
            console.error("Erro ao buscar usuários administrativos:", err);
        }
    }

    // PACOTES -> Carrega os dados da API e mapeia para o formato da tabela
    const [packagesTableData, setPackagesTableData] = useState<TableData[]>([]);
    const [allPackages, setAllPackages] = useState<any[]>([]);

    async function fetchPackages() {
        try {
            const axios = (await import("axios")).default;
            const response = await axios.get("http://localhost:5028/api/TravelPackage/list");
            setAllPackages(response.data);
            const mapped = response.data.map((pkg: any) => ({
                id: pkg.travelPackageId,
                name: pkg.title,
                status: pkg.isActive ? "Ativo" : "Inativo",
                date: pkg.createdAt ? pkg.createdAt.split("T")[0] : "",
                value: formatBRL(pkg.originalPrice),
                remainingSlots: pkg.remainingSlots || "API NAO TRAS VAGAS RESTANTES",
            }));
            setPackagesTableData(mapped);
        } catch (err) {
            console.error("Erro ao buscar pacotes:", err);
        }
    }

    // AFILIADOS -> Carrega os dados da API e mapeia para o formato da tabela
    const [affiliatesTableData, setAffiliatesTableData] = useState<TableData[]>([]);
    const [allAffiliates, setAllAffiliates] = useState<any[]>([]);
    async function fetchAffiliates() {
        try {
            const axios = (await import("axios")).default;
            const response = await axios.get("http://localhost:5028/api/Affiliate/all-adm");
            setAllAffiliates(response.data);
            const mapped = response.data.map((aff: any) => ({
                id: aff.affiliateId,
                name: aff.companyName || aff.name,
                status: aff.isActive ? "Ativo" : "Inativo",
                date: aff.createdAt ? aff.createdAt.split("T")[0] : "",
                value: aff.cnpj
            }));
            setAffiliatesTableData(mapped);
        } catch (err) {
            console.error("Erro ao buscar afiliados:", err);
        }
    }

    // HOTEIS -> Carrega os dados da API e mapeia para o formato da tabela
    const [hotelsTableData, setHotelsTableData] = useState<TableData[]>([]);
    const [allHotels, setAllHotels] = useState<any[]>([]);

    async function fetchHotels() {
        try {
            const axios = (await import("axios")).default;
            const response = await axios.get("http://localhost:5028/api/Hotel");
            setAllHotels(response.data);
            const mapped = response.data.map((hotel: any) => ({
                id: hotel.hotelId,
                name: hotel.name,
                status: hotel.isActive ? "Ativo" : "Inativo",
                date: hotel.createdAt ? hotel.createdAt.split("T")[0] : "",
                value: hotel.affiliateId ? hotel.affiliate?.name : "",
            }));
            setHotelsTableData(mapped);
        } catch (err) {
            console.error("Erro ao buscar hotéis:", err);
        }
    }

    // CLIENTES -> Carrega os dados da API e mapeia para o formato da tabela
    const [clientsTableData, setClientsTableData] = useState<TableData[]>([]);
    const [allClients, setAllClients] = useState<any[]>([]);

    async function fetchClients() {
        try {
            const axios = (await import("axios")).default;
            const response = await axios.get("http://localhost:5028/api/User");
            setAllClients(response.data);
            const mapped = response.data.map((user: any) => ({
                id: user.userId,
                name: `${user.firstName} ${user.lastName}`,
                status: user.isActive ? "Ativo" : "Inativo",
                date: user.createdAt ? user.createdAt.split("T")[0] : "",
                value: user.email
            }));
            setClientsTableData(mapped);
        } catch (err) {
            console.error("Erro ao buscar clientes:", err);
        }
    }

    useEffect(() => {
        async function fetchAll() {
            setIsLoading(true);
            await Promise.all([
                fetchPackages(),
                fetchAffiliates(),
                fetchHotels(),
                fetchClients(),
                fetchUsers()
            ]);
            setIsLoading(false);
        }
        fetchAll();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                menuItems={menuItems}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header activeTab={activeTab} />

                {/* Content */}
                <main
                    className="flex-1 overflow-auto p-10"
                    style={{ background: `linear-gradient(to bottom right, #003194, #003194)` }}
                >
                    {activeTab === "dashboard" ? renderDashboard() : renderTable(activeTab)}
                </main>
            </div>

            {/* Modals */}
            {renderModal()}
            {renderEditModal()}
            {renderEditUserModal()}
            {renderEditAffiliateModal()}
            {renderEditHotelModal()}
            {renderEditClientModal()}
        </div>
    )
}

export default AdminDashboard;