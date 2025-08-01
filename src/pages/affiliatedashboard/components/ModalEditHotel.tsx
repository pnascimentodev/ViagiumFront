import { useState, useEffect } from "react";
import apiClient from "../../../utils/apiClient";
import { validateEmail, validatePassword, validatePhone, validateCNPJ, validateRequired, validateEmailConfirmation, validatePasswordConfirmation, validateFutureDate } from "../../../utils/validations.ts";
import { maskPhone, maskCNPJ, maskInscricaoEstadual, maskCPF, maskPassaporte } from "../../../utils/masks.ts";
import { validateCPF, validatePassaporte } from "../../../utils/validations.ts";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { FaUpload } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import * as MdIcons from "react-icons/md";
import axios from "axios";

interface Amenity {
    amenityId: number;
    name: string;
    iconName: string;
}

interface Hotel {
    id: string;
    name: string;
    location: string;
    status: string;
    image: string;
}

interface HotelData {
    hotelId: number;
    name: string;
    description: string;
    contactNumber: string;
    typeHosting: string;
    isActive: boolean;
    cnpj: string;
    inscricaoEstadual: string;
    cadastur: string;
    cadasturExpiration: string;
    star: number;
    imageUrl: string;
    address: {
        streetName: string;
        addressNumber: number;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        createdAt: string;
        addressId: number | null;
    };
    amenities: Amenity[];
}

interface ModalEditHotelProps {
    isOpen: boolean;
    onClose: () => void;
    hotel: Hotel | null;
    onSave: (updatedHotel: Hotel) => void;
}

function ModalEditHotel({ isOpen, onClose, hotel, onSave }: ModalEditHotelProps) {
    // Mapeamento dos nomes dos ícones para componentes do react-icons/md
    const getIconComponent = (iconName: string) => {
        // Acesso direto aos ícones através do objeto MdIcons
        const IconComponent = (MdIcons as any)[iconName] || MdIcons.MdRectangle;
        return IconComponent;
    };

    // Form state
    const [form, setForm] = useState({
        RazaoSocial: "",
        NomeFantasia: "",
        telefone1: "",
        telefone2: "",
        email: "",
        confirmarEmail: "",
        senha: "",
        confirmarSenha: "",
        cpfPassaporte: "",
        name: "",
        description: "",
        contactNumber: "",
        typeHosting: "",
        cnpj: "",
        cadastur: "",
        cadasturExpiration: "",
        imagemHotel: "",
        streetName: "",
        addressNumber: 0,
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        diferenciais: [] as string[],
        inscricaoEstadual: "",
        estrelas: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loadingAmenities, setLoadingAmenities] = useState(false);
    const [loadingHotelData, setLoadingHotelData] = useState(false);
    const [saving, setSaving] = useState(false);
    //O que é Cadastur? Interrogation
    const [showCadasturInfo, setShowCadasturInfo] = useState(false);

    // Função para buscar amenities da API
    const fetchAmenities = async () => {
        setLoadingAmenities(true);
        try {
            const response = await apiClient.get('/Amenity/Hotel');
            setAmenities(response.data);
        } catch (error) {
            console.error('Erro ao buscar amenities:', error);
            // Fallback para amenities estáticos em caso de erro da API
            setAmenities([
                {
                    amenityId: 49,
                    name: "Academia",
                    iconName: "MdFitnessCenter"
                },
                {
                    amenityId: 38,
                    name: "Acessível para PCD",
                    iconName: "MdAccessible"
                },
                {
                    amenityId: 35,
                    name: "Assistente virtual",
                    iconName: "MdVoiceChat"
                },
                {
                    amenityId: 40,
                    name: "Balcão virtual 24h",
                    iconName: "MdSupportAgent"
                },
                {
                    amenityId: 46,
                    name: "Bar/lounge",
                    iconName: "MdWineBar"
                },
                {
                    amenityId: 36,
                    name: "Berço disponível",
                    iconName: "MdChildFriendly"
                },
                {
                    amenityId: 44,
                    name: "Café da manhã incluso",
                    iconName: "MdFreeBreakfast"
                },
                {
                    amenityId: 37,
                    name: "Entrada com cartão",
                    iconName: "MdCreditCard"
                },
                {
                    amenityId: 52,
                    name: "Espaço kids",
                    iconName: "MdChildCare"
                },
                {
                    amenityId: 39,
                    name: "Estacionamento gratuito",
                    iconName: "MdLocalParking"
                },
                {
                    amenityId: 53,
                    name: "Pet friendly",
                    iconName: "MdPets"
                },
                {
                    amenityId: 34,
                    name: "Piscina",
                    iconName: "MdPool"
                },
                {
                    amenityId: 33,
                    name: "Piscina privativa",
                    iconName: "MdPool"
                },
                {
                    amenityId: 43,
                    name: "Portaria digital",
                    iconName: "MdSensorDoor"
                },
                {
                    amenityId: 45,
                    name: "Restaurante no local",
                    iconName: "MdRestaurant"
                },
                {
                    amenityId: 48,
                    name: "Sala de jogos",
                    iconName: "MdSportsEsports"
                },
                {
                    amenityId: 51,
                    name: "Salas para eventos",
                    iconName: "MdMeetingRoom"
                },
                {
                    amenityId: 41,
                    name: "Serviço de manobrista",
                    iconName: "MdDriveEta"
                },
                {
                    amenityId: 42,
                    name: "Serviço de quarto",
                    iconName: "MdRoomService"
                },
                {
                    amenityId: 50,
                    name: "Spa e bem-estar",
                    iconName: "MdSpa"
                },
                {
                    amenityId: 47,
                    name: "Teatro no hotel",
                    iconName: "MdTheaterComedy"
                }
            ]);
        } finally {
            setLoadingAmenities(false);
        }
    };

    // Função para buscar dados do hotel da API
    const fetchHotelData = async (hotelId: string) => {
        setLoadingHotelData(true);
        try {
            const response = await apiClient.get(`/Hotel/${hotelId}`);
            const hotelData: HotelData = response.data;

            // Preencher o formulário com os dados do hotel
            setForm({
                RazaoSocial: "",
                NomeFantasia: "",
                telefone1: "",
                telefone2: "",
                email: "",
                confirmarEmail: "",
                senha: "",
                confirmarSenha: "",
                cpfPassaporte: "",
                name: hotelData.name || "",
                description: hotelData.description || "",
                contactNumber: hotelData.contactNumber || "",
                typeHosting: hotelData.typeHosting || "",
                cnpj: hotelData.cnpj || "",
                cadastur: hotelData.cadastur || "",
                cadasturExpiration: hotelData.cadasturExpiration ? hotelData.cadasturExpiration.split('T')[0] : "",
                imagemHotel: hotelData.imageUrl || "",
                streetName: hotelData.address?.streetName || "",
                addressNumber: hotelData.address?.addressNumber || 0,
                neighborhood: hotelData.address?.neighborhood || "",
                city: hotelData.address?.city || "",
                state: hotelData.address?.state || "",
                zipCode: hotelData.address?.zipCode || "",
                country: hotelData.address?.country || "",
                diferenciais: hotelData.amenities ? hotelData.amenities.map(amenity => amenity.amenityId.toString()) : [],
                inscricaoEstadual: hotelData.inscricaoEstadual || "",
                estrelas: hotelData.star ? hotelData.star.toString() : "",
            });
        } catch (error) {
            console.error('Erro ao buscar dados do hotel:', error);
            alert('Erro ao carregar dados do hotel. Tente novamente.');
        } finally {
            setLoadingHotelData(false);
        }
    };

    // Carrega dados do hotel e amenities quando o modal abre
    useEffect(() => {
        if (isOpen) {
            fetchAmenities();
            if (hotel) {
                fetchHotelData(hotel.id);
            }
        }
    }, [isOpen, hotel]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value, type } = target;
        const checked = 'checked' in target ? target.checked : false;
        let newValue = value;
        switch (name) {
            case "telefone1":
            case "telefone2":
            case "contactNumber":
                newValue = maskPhone(value);
                break;
            case "cnpj":
                newValue = maskCNPJ(value);
                break;
            case "inscricaoEstadual":
                newValue = maskInscricaoEstadual(value);
                break;
            case "cpfPassaporte": {
                const onlyNumbers = value.replace(/\D/g, "");
                // CPF: só números, até 11 dígitos
                if (/^\d{1,11}$/.test(onlyNumbers) && onlyNumbers.length > 0) {
                    newValue = maskCPF(onlyNumbers);
                } else if (/^[A-Za-z0-9]{6,12}$/.test(value)) {
                    // Passaporte: letras e números juntos, 6 a 12 caracteres
                    newValue = maskPassaporte(value);
                } else {
                    newValue = value;
                }
                break;
            }
            default:
                // outros campos sem máscara
                break;
        }
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : newValue }));
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }

    function validateCEP(cep: string){
        if(!cep || cep.trim() === "") {
            return false;
        }
        else{
            return true;
        }    
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        let error = "";
        switch (name) {
            case "cpfPassaporte": {
                const onlyNumbers = value.replace(/\D/g, "");
                if (onlyNumbers.length === 11) {
                    if (!validateCPF(value)) error = "CPF inválido.";
                } else {
                    if (!validatePassaporte(value)) error = "Passaporte inválido (mín. 6 caracteres).";
                }
                break;
            }
            case "email":
                if (!validateEmail(value)) error = "Digite um e-mail válido.";
                break;
            case "confirmarEmail":
                error = validateEmailConfirmation(form.email, value) || "";
                break;
            case "senha":
                error = validatePassword(value) || "";
                break;
            case "confirmarSenha":
                error = validatePasswordConfirmation(form.senha, value) || "";
                break;
            case "telefone1":
            case "telefone2":
            case "contactNumber":
                if (!validatePhone(value)) error = "Telefone inválido.";
                break;
            case "zipCode":
                if (!validateCEP(value)) error = "CEP inválido.";
                break;
            case "cnpj":
                if (!validateCNPJ(value)) error = "CNPJ inválido.";
                break;
            case "cadastur":
                // Cadastur é apenas para visualização, não validar
                break;
            case "cadasturExpiration":
                if (value && !validateFutureDate(value)) error = "Data deve ser futura.";
                break;
            case "estrelas":
                const starsValue = parseInt(value);
                if (!value || isNaN(starsValue) || starsValue < 1 || starsValue > 5) {
                    error = "Digite um número de 1 a 5.";
                }
                break;
            default:
                if (!validateRequired(value)) error = "Campo obrigatório.";
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    }

    function handleSubmit(e: React.FormEvent) {
        console.log('Botão Salvar Alterações clicado!');
        e.preventDefault();
        if (!hotel) {
            console.log("Erro: hotel não encontrado");
            return;
        }
        
        console.log("Hotel ID:", hotel.id);
        console.log("Hotel objeto completo:", hotel);
        setSaving(true);

        const newErrors: { [key: string]: string } = {};

        // Validação apenas dos campos que existem no formulário de edição
        if (!validateRequired(form.name)) newErrors.name = "Campo obrigatório.";
        if (!validateRequired(form.description)) newErrors.description = "Campo obrigatório.";
        if (!validateRequired(form.contactNumber)) newErrors.contactNumber = "Campo obrigatório.";
        if (!validateRequired(form.typeHosting)) newErrors.typeHosting = "Campo obrigatório.";
        if (!validateRequired(form.zipCode)) newErrors.zipCode = "Campo obrigatório.";
        if (!validateRequired(form.streetName)) newErrors.streetName = "Campo obrigatório.";
        if (!validateRequired(form.neighborhood)) newErrors.neighborhood = "Campo obrigatório.";
        if (!validateRequired(form.city)) newErrors.city = "Campo obrigatório.";
        if (!validateRequired(form.state)) newErrors.state = "Campo obrigatório.";
        if (!validateRequired(form.country)) newErrors.country = "Campo obrigatório.";
        if (!validateRequired(form.imagemHotel)) newErrors.imagemHotel = "Campo obrigatório.";
        if (!validateCNPJ(form.cnpj)) newErrors.cnpj = "CNPJ inválido.";
        if (!validateRequired(form.inscricaoEstadual)) newErrors.inscricaoEstadual = "Campo obrigatório.";
        if (!validatePhone(form.contactNumber)) newErrors.contactNumber = "Telefone inválido.";
        if (!validateCEP(form.zipCode)) newErrors.zipCode = "CEP inválido.";
        
        const starsValue = parseInt(form.estrelas);
        if (!form.estrelas || isNaN(starsValue) || starsValue < 1 || starsValue > 5) {
            newErrors.estrelas = "Digite um número de 1 a 5.";
        }

        // Validação da data de expiração do Cadastur
        if (form.cadasturExpiration && !validateFutureDate(form.cadasturExpiration)) {
            newErrors.cadasturExpiration = "Data deve ser futura.";
        }

        console.log("Erros encontrados:", newErrors);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            console.log("Salvamento cancelado devido a erros de validação");
            setSaving(false);
            return;
        }

        // Monte o array de amenities selecionados (apenas os IDs)
        const selectedAmenityIds = amenities
            .filter(a => form.diferenciais.includes(a.amenityId.toString()))
            .map(a => a.amenityId); // Apenas o ID, não o objeto completo

        // Preparar dados para envio - estrutura correta esperada pela API
        const updateData = {
            hotelUpdateDTO: {
                hotelId: parseInt(hotel.id),
                name: form.name,
                description: form.description,
                contactNumber: form.contactNumber,
                typeHosting: form.typeHosting,
                isActive: true,
                cnpj: form.cnpj,
                inscricaoEstadual: form.inscricaoEstadual,
                cadastur: form.cadastur,
                cadasturExpiration: form.cadasturExpiration ? `${form.cadasturExpiration}T00:00:00.000Z` : null,
                star: parseInt(form.estrelas) || 0,
                imageUrl: form.imagemHotel,
                address: {
                    streetName: form.streetName,
                    addressNumber: form.addressNumber,
                    neighborhood: form.neighborhood,
                    city: form.city,
                    state: form.state,
                    zipCode: form.zipCode,
                    country: form.country,
                    createdAt: new Date().toISOString(),
                },
                amenities: selectedAmenityIds, // Array de IDs apenas
            }
        };
        
        console.log("URL da requisição:", `http://localhost:5028/api/Hotel/${hotel.id}`);
        console.log("Dados sendo enviados:", updateData);

        axios.put(`http://localhost:5028/api/Hotel/${hotel.id}`, updateData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                console.log("Resposta da API:", response);
                onSave({ ...hotel, ...updateData });
                onClose();
            })
            .catch((error) => {
                console.error("Erro detalhado:", error);
                console.error("Response data:", error.response?.data);
                console.error("Response status:", error.response?.status);
                console.error("Response headers:", error.response?.headers);
                
                const errorMessage = error.response?.data?.message || 
                                   error.response?.data?.title || 
                                   error.message || 
                                   "Erro desconhecido";
                                   
                alert(`Erro ao atualizar hotel: ${errorMessage}`);
            })
            .finally(() => {
                console.log("Finalizando requisição");
                setSaving(false);
            });
        }

    function handleCloseModal() {
        onClose();
    }

    function handleBackdropClick(e: React.MouseEvent) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    if (!isOpen || !hotel) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header do Modal */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-3xl font-bold text-[#003194]">Editar Hotel</h2>
                    <IoClose
                        type="button"
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
                    />
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="pt-6">
                            <h3 className="text-2xl font-semibold text-[#003194] mb-6">Dados do Hotel</h3>

                            {/* Loading state */}
                            {loadingHotelData && (
                                <div className="flex items-center justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003194] mr-3"></div>
                                    <span className="text-[#003194]">Carregando dados do hotel...</span>
                                </div>
                            )}

                            {!loadingHotelData && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-[#003194] mb-2">
                                                Nome da hospedagem *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Insira o nome fantasia do hotel"
                                                value={form.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.name && <div style={{ color: "red", fontWeight: 500 }}>{errors.name}</div>}
                                        </div>

                                        {/* Tipo */}
                                        <div>
                                            <label htmlFor="typeHosting" className="block text-sm font-medium text-[#003194] mb-2">
                                                Tipo *
                                            </label>
                                            <input
                                                type="text"
                                                id="typeHosting"
                                                name="typeHosting"
                                                placeholder="Ex: Hotel, Pousada, Resort, Hostel"
                                                value={form.typeHosting}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.typeHosting ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.typeHosting && <div style={{ color: "red", fontWeight: 500 }}>{errors.typeHosting}</div>}
                                        </div>
                                    </div>

                                    {/* CEP e Endereço */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="zipCode" className="block text-sm font-medium text-[#003194] mb-2">
                                                CEP *
                                            </label>
                                            <input
                                                type="text"
                                                id="zipCode"
                                                name="zipCode"
                                                placeholder="00000-000"
                                                value={form.zipCode}
                                                onChange={(e) => {
                                                    const maskedValue = (e.target.value);
                                                    setForm(prev => ({ ...prev, zipCode: maskedValue }));
                                                    setErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.zipCode;
                                                        return newErrors;
                                                    });
                                                }}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.zipCode && <div style={{ color: "red", fontWeight: 500 }}>{errors.zipCode}</div>}
                                        </div>

                                        {/* Rua */}
                                        <div>
                                            <label htmlFor="streetName" className="block text-sm font-medium text-[#003194] mb-2">
                                                Rua *
                                            </label>
                                            <input
                                                type="text"
                                                id="streetName"
                                                name="streetName"
                                                placeholder="Nome da rua"
                                                value={form.streetName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.streetName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.streetName && <div style={{ color: "red", fontWeight: 500 }}>{errors.streetName}</div>}
                                        </div>
                                    </div>

                                    {/* Número, Bairro, Cidade */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="addressNumber" className="block text-sm font-medium text-[#003194] mb-2">
                                                Número
                                            </label>
                                            <input
                                                type="number"
                                                id="addressNumber"
                                                name="addressNumber"
                                                placeholder="123"
                                                value={form.addressNumber || ""}
                                                onChange={(e) => {
                                                    setForm(prev => ({ ...prev, addressNumber: parseInt(e.target.value) || 0 }));
                                                    setErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.addressNumber;
                                                        return newErrors;
                                                    });
                                                }}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="neighborhood" className="block text-sm font-medium text-[#003194] mb-2">
                                                Bairro *
                                            </label>
                                            <input
                                                type="text"
                                                id="neighborhood"
                                                name="neighborhood"
                                                placeholder="Bairro"
                                                value={form.neighborhood}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.neighborhood ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.neighborhood && <div style={{ color: "red", fontWeight: 500 }}>{errors.neighborhood}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-[#003194] mb-2">
                                                Cidade *
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                placeholder="Cidade"
                                                value={form.city}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.city && <div style={{ color: "red", fontWeight: 500 }}>{errors.city}</div>}
                                        </div>
                                    </div>

                                    {/* Estado e País */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-[#003194] mb-2">
                                                Estado *
                                            </label>
                                            <input
                                                type="text"
                                                id="state"
                                                name="state"
                                                placeholder="Estado"
                                                value={form.state}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.state && <div style={{ color: "red", fontWeight: 500 }}>{errors.state}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="country" className="block text-sm font-medium text-[#003194] mb-2">
                                                País *
                                            </label>
                                            <input
                                                type="text"
                                                id="country"
                                                name="country"
                                                placeholder="País"
                                                value={form.country}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.country && <div style={{ color: "red", fontWeight: 500 }}>{errors.country}</div>}
                                        </div>
                                    </div>

                                    {/* Telefone e Estrelas */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="contactNumber" className="block text-sm font-medium text-[#003194] mb-2">
                                                Telefone *
                                            </label>
                                            <input
                                                type="text"
                                                id="contactNumber"
                                                name="contactNumber"
                                                placeholder="(00) 00000-0000"
                                                value={form.contactNumber}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const newNumbers = value.replace(/\D/g, '');
                                                    const oldNumbers = form.contactNumber.replace(/\D/g, '');
                                                    if (newNumbers.length < oldNumbers.length) {
                                                        setForm(prev => ({ ...prev, contactNumber: newNumbers }));
                                                    } else {
                                                        const maskedValue = value === '' ? '' : maskPhone(value);
                                                        setForm(prev => ({ ...prev, contactNumber: maskedValue }));
                                                    }
                                                    
                                                    setErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.contactNumber;
                                                        return newErrors;
                                                    });
                                                }}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.contactNumber && <div style={{ color: "red", fontWeight: 500 }}>{errors.contactNumber}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="estrelas" className="block text-sm font-medium text-[#003194] mb-2">
                                                Quantas estrelas tem o seu hotel? *
                                            </label>
                                            <input
                                                type="number"
                                                id="estrelas"
                                                name="estrelas"
                                                placeholder="Digite de 1 a 5"
                                                value={form.estrelas || ""}
                                                onChange={e => {
                                                    const value = e.target.value;
                                                    // Permite apenas números de 1 a 5
                                                    if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 5)) {
                                                        setForm(prev => ({ ...prev, estrelas: value }));
                                                        setErrors(prev => {
                                                            const newErrors = { ...prev };
                                                            delete newErrors.estrelas;
                                                            return newErrors;
                                                        });
                                                    }
                                                }}
                                                onBlur={handleBlur}
                                                min="1"
                                                max="5"
                                                className={`w-full px-3 py-2 border ${errors.estrelas ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.estrelas && <div style={{ color: "red", fontWeight: 500 }}>{errors.estrelas}</div>}
                                        </div>
                                    </div>

                                    {/* Upload de Imagem */}
                                    <div className="mb-4 flex flex-col items-center w-full">
                                        <label
                                            htmlFor="imagemHotel"
                                            className={`w-full flex flex-col items-center justify-center px-3 py-6 border-2 border-dotted cursor-pointer transition-colors duration-150 ${errors.imagemHotel ? 'border-red-500' : 'border-gray-300'
                                                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent text-center`}
                                            style={{ textAlign: "center" }}
                                        >
                                            <FaUpload className="text-[#003194] text-3xl mb-2" />
                                            <span className="block text-sm font-medium text-[#003194] mb-2 text-center">
                                                Imagem do hotel *
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Formatos: JPG, PNG, GIF, WebP, SVG or BMP
                                            </span>
                                            <input
                                                type="file"
                                                id="imagemHotel"
                                                name="imagemHotel"
                                                accept="image/*"
                                                onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => {
                                                            setForm(prev => ({
                                                                ...prev,
                                                                imagemHotel: ev.target?.result as string
                                                            }));
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setForm(prev => ({
                                                            ...prev,
                                                            imagemHotel: ""
                                                        }));
                                                    }
                                                    setErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.imagemHotel;
                                                        return newErrors;
                                                    });
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                        {/* Preview da imagem */}
                                        {form.imagemHotel && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="truncate max-w-xs text-gray-700 text-sm">
                                                    {(() => {
                                                        // Extrai o nome do arquivo do DataURL, se possível
                                                        const input = document.getElementById("imagemHotel") as HTMLInputElement | null;
                                                        if (input && input.files && input.files[0]) {
                                                            return input.files[0].name;
                                                        }
                                                        // fallback: mostra apenas "Arquivo selecionado"
                                                        return "Imagem carregada";
                                                    })()}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setForm(prev => ({ ...prev, imagemHotel: "" }))}
                                                    className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        )}
                                        {errors.imagemHotel && <div style={{ color: "red", fontWeight: 500 }}>{errors.imagemHotel}</div>}
                                    </div>

                                    {/* Descrição */}
                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-medium text-[#003194] mb-2">
                                            Descrição do hotel *
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Descreva o hotel"
                                            value={form.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            rows={4}
                                            className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                        />
                                        {errors.description && <div style={{ color: "red", fontWeight: 500 }}>{errors.description}</div>}
                                    </div>

                                    {/* Diferenciais do hotel */}
                                    <div className="mb-4 mt-5">
                                        <label className="block text-sm font-medium text-[#003194] mb-2">
                                            Diferenciais do hotel
                                        </label>
                                        {loadingAmenities ? (
                                            <div className="rounded-md border border-gray-300 p-4">
                                                <div className="flex items-center justify-center text-[#003194]">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#003194] mr-2"></div>
                                                    Carregando amenities...
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-md border border-gray-300 p-4">
                                                {amenities.map((amenity) => {
                                                    const IconComponent = getIconComponent(amenity.iconName);
                                                    return (
                                                        <label key={amenity.amenityId} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                name="diferenciais"
                                                                value={amenity.amenityId.toString()}
                                                                checked={form.diferenciais.includes(amenity.amenityId.toString())}
                                                                onChange={e => {
                                                                    const checked = e.target.checked;
                                                                    setForm(prev => {
                                                                        return {
                                                                            ...prev,
                                                                            diferenciais: checked
                                                                                ? [...prev.diferenciais, amenity.amenityId.toString()]
                                                                                : prev.diferenciais.filter(v => v !== amenity.amenityId.toString())
                                                                        };
                                                                    });
                                                                    setErrors(prev => {
                                                                        const newErrors = { ...prev };
                                                                        delete newErrors.diferenciais;
                                                                        return newErrors;
                                                                    });
                                                                }}
                                                                className="h-4 w-4 text-[#003194] border-gray-300 rounded focus:ring-[#003194]"
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <IconComponent className="text-lg text-[#003194]" />
                                                                <span className="text-[#003194] font-medium">{amenity.name}</span>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {errors.diferenciais && <div style={{ color: "red", fontWeight: 500 }}>{errors.diferenciais}</div>}
                                    </div>

                                    {/* CNPJ e Inscrição Estadual */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-7">
                                        <div>
                                            <label htmlFor="cnpj" className="block text-sm font-medium text-[#003194] mb-2">
                                                CNPJ *
                                            </label>
                                            <input
                                                type="text"
                                                id="cnpj"
                                                name="cnpj"
                                                placeholder="00.000.000/0000-00"
                                                value={form.cnpj}
                                                onChange={(e) => {
                                                    const maskedValue = maskCNPJ(e.target.value);
                                                    setForm(prev => ({ ...prev, cnpj: maskedValue }));
                                                    setErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.cnpj;
                                                        return newErrors;
                                                    });
                                                }}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.cnpj ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.cnpj && <div style={{ color: "red", fontWeight: 500 }}>{errors.cnpj}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="inscricaoEstadual" className="block text-sm font-medium text-[#003194] mb-2">
                                                Inscrição Estadual *
                                            </label>
                                            <input
                                                type="text"
                                                id="inscricaoEstadual"
                                                name="inscricaoEstadual"
                                                placeholder="Inscrição na Receita Estadual"
                                                value={form.inscricaoEstadual}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-2 border ${errors.inscricaoEstadual ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                            />
                                            {errors.inscricaoEstadual && <div style={{ color: "red", fontWeight: 500 }}>{errors.inscricaoEstadual}</div>}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Seção Cadastur */}
                        {!loadingHotelData && (
                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="text-xl font-bold text-[#003194]">Cadastur</h3>
                                    <HiQuestionMarkCircle
                                        className="text-gray-400 cursor-pointer hover:text-gray-600"
                                        size={20}
                                        title="Informações sobre o sistema Cadastur"
                                    />
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showCadasturInfo}
                                            onChange={(e) => setShowCadasturInfo(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <span className="text-sm text-[#003194] hover:underline">
                                            {showCadasturInfo ? "Ocultar informações" : "Mostrar informações"}
                                        </span>
                                    </label>
                                </div>

                                {showCadasturInfo && (
                                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                        <p className="text-sm text-[#003194] mb-2">
                                            <strong>O que é o Cadastur?</strong>
                                        </p>
                                        <p className="text-xs text-gray-600 mb-3">
                                            O Cadastur (Cadastro de Prestadores de Serviços Turísticos) é um sistema do Ministério do Turismo que registra pessoas físicas e jurídicas que atuam no setor de turismo no Brasil.
                                        </p>
                                        <p className="text-sm text-[#003194] mb-2">
                                            <strong>Informações importantes:</strong>
                                        </p>
                                        <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                                            <li>O registro no Cadastur é obrigatório para prestadores de serviços turísticos</li>
                                            <li>O número Cadastur deve estar sempre atualizado</li>
                                            <li>A validade do registro deve ser renovada periodicamente</li>
                                            <li>Mantenha seus dados sempre atualizados no sistema</li>
                                        </ul>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="cadastur" className="block text-sm font-medium text-[#003194] mb-2">
                                            Número Cadastur (Visualização)
                                        </label>
                                        <input
                                            type="text"
                                            id="cadastur"
                                            name="cadastur"
                                            placeholder="Ex: ABC123 ou 123456"
                                            value={form.cadastur}
                                            readOnly
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                        <small className="text-gray-500">Este campo é apenas para visualização</small>
                                    </div>

                                    <div>
                                        <label htmlFor="cadasturExpiration" className="block text-sm font-medium text-[#003194] mb-2">
                                            Data de Expiração
                                        </label>
                                        <input
                                            type="date"
                                            id="cadasturExpiration"
                                            name="cadasturExpiration"
                                            value={form.cadasturExpiration}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] ${
                                                errors.cadasturExpiration ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        {errors.cadasturExpiration && (
                                            <div style={{ color: "red", fontWeight: 500 }}>{errors.cadasturExpiration}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botões de ação */}
                        <div className="pt-10 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={saving}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold text-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                CANCELAR
                            </button>
                            <button
                                type="submit"
                                disabled={saving || loadingHotelData}
                                className="px-6 py-3 bg-[#003194] text-white rounded-md font-semibold text-lg hover:bg-[#002a7a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalEditHotel;
