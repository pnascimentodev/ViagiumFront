import { useState, useEffect } from "react";
import axios from "axios";
import { validateEmail, validatePassword, validatePhone, validateCEP, validateCNPJ, validateRequired, validateEmailConfirmation, validatePasswordConfirmation, validateFutureDate, validateTerms } from "../../../utils/validations.ts";
import { maskPhone, maskCEP, maskCNPJ, maskInscricaoEstadual, maskCPF, maskPassaporte } from "../../../utils/masks.ts";
import { validateCPF, validatePassaporte } from "../../../utils/validations.ts";
import { FaUpload } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdCheck } from "react-icons/md";
import * as MdIcons from "react-icons/md";
import { AuthService } from "../../../utils/auth.ts";

interface ModalHotelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Amenity {
    amenityId: number;
    name: string;
    iconName: string;
}

function ModalHotel({ isOpen, onClose }: ModalHotelProps) {
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
        nomeHospedagem: "",
        tipo: "",
        cep: "",
        rua: "",
        numero: 0,
        bairro: "",
        cidade: "",
        estado: "",
        pais: "",
        telefoneHotel: "",
        estrelas: "",
        imagemHotel: "",
        descricao: "",
        diferenciais: [] as string[],
        cnpj: "",
        inscricaoEstadual: "",
        numeroCadastur: "",
        dataExpiracao: "",
        termos: false,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loadingAmenities, setLoadingAmenities] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);

    // Função para buscar amenities da API
    const fetchAmenities = async () => {
        setLoadingAmenities(true);
        try {
            const token = AuthService.getAffiliateToken();

            const response = await axios.get('http://localhost:5028/api/Amenity/Hotel', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });
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

    // Carrega amenities quando o modal abre
    useEffect(() => {
        if (isOpen) {
            fetchAmenities();
        }
    }, [isOpen]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value, type } = target;
        const checked = 'checked' in target ? target.checked : false;
        let newValue = value;
        switch (name) {
            case "telefone1":
            case "telefone2":
                newValue = maskPhone(value);
                break;
            case "cep":
                newValue = maskCEP(value);
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
                if (!validatePhone(value)) error = "Telefone inválido.";
                break;
            case "cep":
                if (!validateCEP(value)) error = "CEP inválido.";
                break;
            case "cnpj":
                if (!validateCNPJ(value)) error = "CNPJ inválido.";
                break;
            case "numeroCadastur":
                // Mudando validação para aceitar texto - não apenas números
                if (!validateRequired(value)) error = "Campo obrigatório.";
                break;
            case "dataExpiracao":
                if (value && !validateFutureDate(value)) error = "Data inválida.";
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

    // Função para criar o hotel
    const createHotel = async () => {
        try {
            const token = AuthService.getAffiliateToken();
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            // Obter o ID do afiliado do token ou localStorage
            const affiliateAuth = AuthService.getAffiliateAuth();
            const affiliateId = affiliateAuth?.id || '0';

            // Criar FormData para multipart/form-data
            const formData = new FormData();

            // Mapeamento dos dados do formulário para os campos da API
            formData.append('Name', form.nomeHospedagem);
            formData.append('TypeHosting', form.tipo);
            formData.append('Description', form.descricao);
            formData.append('ContactNumber', form.telefoneHotel);
            formData.append('Cnpj', form.cnpj.replace(/\D/g, '')); // Remove formatação do CNPJ
            formData.append('Cadastur', form.numeroCadastur);
            formData.append('CadasturExpiration', form.dataExpiracao);
            formData.append('AffiliateId', affiliateId);
            formData.append('ImageUrl', ''); // Campo vazio conforme exemplo

            // Dados do endereço
            formData.append('Address.StreetName', form.rua);
            formData.append('Address.AddressNumber', '0'); // Valor padrão
            formData.append('Address.Neighborhood', form.bairro);
            formData.append('Address.City', form.estado); // Usando estado como cidade
            formData.append('Address.State', form.estado);
            formData.append('Address.Country', form.pais);
            formData.append('Address.ZipCode', form.cep); // Mantém a formatação do CEP (00000-000)
            formData.append('Address.AddressId', '0'); // Valor padrão
            formData.append('Address.CreatedAt', new Date().toISOString());

            // Amenities - converter os IDs selecionados para números
            form.diferenciais.forEach(amenityId => {
                formData.append('Amenities', amenityId);
            });

            // Imagem do hotel
            const fileInput = document.getElementById('imagemHotel') as HTMLInputElement;
            if (fileInput?.files?.[0]) {
                formData.append('Image', fileInput.files[0]);
            } else {
                formData.append('Image', ''); // Campo vazio se não houver arquivo
            }

            // Fazer a chamada para a API
            const response = await axios.post('http://localhost:5028/api/Hotel/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao criar hotel:', error);
            throw error;
        }
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        // Validação de todos os campos
        if (!validateRequired(form.nomeHospedagem)) newErrors.nomeHospedagem = "Campo obrigatório.";
        if (!validateRequired(form.tipo)) newErrors.tipo = "Campo obrigatório.";
        if (!validateCEP(form.cep)) newErrors.cep = "CEP inválido.";
        if (!validateRequired(form.rua)) newErrors.rua = "Campo obrigatório.";
        if (!form.numero || form.numero === 0) newErrors.numero = "Campo obrigatório.";
        if (!validateRequired(form.bairro)) newErrors.bairro = "Campo obrigatório.";
        if (!validateRequired(form.cidade)) newErrors.cidade = "Campo obrigatório.";
        if (!validateRequired(form.estado)) newErrors.estado = "Campo obrigatório.";
        if (!validateRequired(form.pais)) newErrors.pais = "Campo obrigatório.";
        if (!validateRequired(form.telefoneHotel)) newErrors.telefoneHotel = "Campo obrigatório.";
        if (!validateRequired(form.imagemHotel)) newErrors.imagemHotel = "Campo obrigatório.";
        if (!validateRequired(form.descricao)) newErrors.descricao = "Campo obrigatório.";
        const starsValue = parseInt(form.estrelas);
        if (!form.estrelas || isNaN(starsValue) || starsValue < 1 || starsValue > 5) {
            newErrors.estrelas = "Digite um número de 1 a 5.";
        }
        if (!validateCNPJ(form.cnpj)) newErrors.cnpj = "CNPJ inválido.";
        if (!validateRequired(form.inscricaoEstadual)) newErrors.inscricaoEstadual = "Campo obrigatório.";
        // Alterando validação do Cadastur para aceitar texto
        if (!validateRequired(form.numeroCadastur)) newErrors.numeroCadastur = "Campo obrigatório.";
        if (!validateFutureDate(form.dataExpiracao)) newErrors.dataExpiracao = "Data inválida.";
        if (!validateTerms(form.termos)) newErrors.termos = "Você deve aceitar os termos.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsSubmitting(true);

        // Chamar a função de criação do hotel
        createHotel()
            .then((result) => {
                console.log('Hotel criado com sucesso:', result);
                setShowSuccessNotification(true);
                setTimeout(() => {
                    setShowSuccessNotification(false);
                    onClose();
                }, 3000); // Fecha o modal após 3 segundos
            })
            .catch((error) => {
                console.error('Erro ao cadastrar hotel:', error);
                if (error.response?.status === 401) {
                    alert("Erro de autenticação. Faça login novamente.");
                } else if (error.response?.data?.message) {
                    alert(`Erro: ${error.response.data.message}`);
                } else {
                    alert("Erro ao cadastrar hotel. Tente novamente.");
                }
            })
            .finally(() => {
                setIsSubmitting(false);
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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header do Modal */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-3xl font-bold text-[#003194]">Cadastro de Hotel</h2>
                    <IoClose
                        type="button"
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </IoClose >
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Dados da hospedagem */}
                        <div className="pt-6">
                            <h3 className="text-2xl font-semibold text-[#003194] mb-6">Dados do Hotel</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="nomeHospedagem" className="block text-sm font-medium text-[#003194] mb-2">
                                        Nome da hospedagem *
                                    </label>
                                    <input
                                        type="text"
                                        id="nomeHospedagem"
                                        name="nomeHospedagem"
                                        placeholder="Insira o nome fantasia do hotel"
                                        value={form.nomeHospedagem}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.nomeHospedagem ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.nomeHospedagem && <div style={{ color: "red", fontWeight: 500 }}>{errors.nomeHospedagem}</div>}
                                </div>

                                {/* Tipo */}
                                <div>
                                    <label htmlFor="tipo" className="block text-sm font-medium text-[#003194] mb-2">
                                        Tipo *
                                    </label>
                                    <select
                                        id="tipo"
                                        name="tipo"
                                        value={form.tipo}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.tipo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    >
                                        <option value="">Selecione o tipo de hospedagem</option>
                                        <option value="hotel">Hotel</option>
                                        <option value="pousada">Pousada</option>
                                        <option value="resort">Resort</option>
                                        <option value="hostel">Hostel</option>
                                    </select>
                                    {errors.tipo && <div style={{ color: "red", fontWeight: 500 }}>{errors.tipo}</div>}
                                </div>
                            </div>

                            {/* CEP e Rua */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="cep" className="block text-sm font-medium text-[#003194] mb-2">
                                        CEP *
                                    </label>
                                    <input
                                        type="text"
                                        id="cep"
                                        name="cep"
                                        placeholder="00000-000"
                                        value={form.cep}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.cep ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.cep && <div style={{ color: "red", fontWeight: 500 }}>{errors.cep}</div>}
                                </div>

                                {/* Rua */}
                                <div>
                                    <label htmlFor="rua" className="block text-sm font-medium text-[#003194] mb-2">
                                        Rua *
                                    </label>
                                    <input
                                        type="text"
                                        id="rua"
                                        name="rua"
                                        placeholder="Rua"
                                        value={form.rua}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.rua ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.rua && <div style={{ color: "red", fontWeight: 500 }}>{errors.rua}</div>}
                                </div>
                            </div>

                            {/* Número, Bairro e Cidade */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label htmlFor="numero" className="block text-sm font-medium text-[#003194] mb-2">
                                        Número *
                                    </label>
                                    <input
                                        type="number"
                                        id="numero"
                                        name="numero"
                                        placeholder="123"
                                        value={form.numero || ""}
                                        onChange={(e) => {
                                            setForm(prev => ({ ...prev, numero: parseInt(e.target.value) || 0 }));
                                            setErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.numero;
                                                return newErrors;
                                            });
                                        }}
                                        onBlur={(e) => {
                                            const value = e.target.value;
                                            let error = "";
                                            if (!value || parseInt(value) === 0) {
                                                error = "Campo obrigatório.";
                                            }
                                            setErrors(prev => ({ ...prev, numero: error }));
                                        }}
                                        className={`w-full px-3 py-2 border ${errors.numero ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.numero && <div style={{ color: "red", fontWeight: 500 }}>{errors.numero}</div>}
                                </div>

                                <div>
                                    <label htmlFor="bairro" className="block text-sm font-medium text-[#003194] mb-2">
                                        Bairro *
                                    </label>
                                    <input
                                        type="text"
                                        id="bairro"
                                        name="bairro"
                                        placeholder="Bairro"
                                        value={form.bairro}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.bairro ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.bairro && <div style={{ color: "red", fontWeight: 500 }}>{errors.bairro}</div>}
                                </div>

                                <div>
                                    <label htmlFor="cidade" className="block text-sm font-medium text-[#003194] mb-2">
                                        Cidade *
                                    </label>
                                    <input
                                        type="text"
                                        id="cidade"
                                        name="cidade"
                                        placeholder="Cidade"
                                        value={form.cidade}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.cidade ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.cidade && <div style={{ color: "red", fontWeight: 500 }}>{errors.cidade}</div>}
                                </div>
                            </div>

                            {/* Estado e País */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* Estado */}
                                <div>
                                    <label htmlFor="estado" className="block text-sm font-medium text-[#003194] mb-2">
                                        Estado *
                                    </label>
                                    <input
                                        type="text"
                                        id="estado"
                                        name="estado"
                                        placeholder="Estado"
                                        value={form.estado}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.estado ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.estado && <div style={{ color: "red", fontWeight: 500 }}>{errors.estado}</div>}
                                </div>

                                {/* Pais */}
                                <div>
                                    <label htmlFor="pais" className="block text-sm font-medium text-[#003194] mb-2">
                                        País *
                                    </label>
                                    <input
                                        type="text"
                                        id="pais"
                                        name="pais"
                                        placeholder="País"
                                        value={form.pais}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.pais ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.pais && <div style={{ color: "red", fontWeight: 500 }}>{errors.pais}</div>}
                                </div>
                            </div>

                            {/* Telefone Hotel e Estrelas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* DIV Telefone */}
                                <div className="mb-4 mt-4">
                                    <label htmlFor="telefoneHotel" className="block text-sm font-medium text-[#003194] mb-2">
                                        Telefone *
                                    </label>
                                    <input
                                        type="text"
                                        id="telefoneHotel"
                                        name="telefoneHotel"
                                        placeholder="(00) 00000-0000"
                                        value={form.telefoneHotel || ""}
                                        onChange={e => {
                                            // Permite apenas números e limita a 11 dígitos
                                            let value = e.target.value.replace(/\D/g, "").slice(0, 11);
                                            value = maskPhone(value); // aplica a máscara se desejar
                                            setForm(prev => ({ ...prev, telefoneHotel: value }));
                                            setErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.telefoneHotel;
                                                return newErrors;
                                            });
                                        }}
                                        onBlur={handleBlur}
                                        maxLength={15} // limita o input visual (com máscara pode ser até 15)
                                        className={`w-full px-3 py-2 border ${errors.telefoneHotel ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.telefoneHotel && <div style={{ color: "red", fontWeight: 500 }}>{errors.telefoneHotel}</div>}
                                </div>

                                {/* Estrelas */}
                                <div className="mb-4 mt-4">
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
                                                return "Arquivo selecionado";
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

                            {/* Descricao */}
                            <div className="mb-4">
                                <label htmlFor="descricao" className="block text-sm font-medium text-[#003194] mb-2">
                                    Descrição do hotel *
                                </label>
                                {/* <textarea // a descricao aparece blurrada */}
                                <textarea
                                    id="descricao"
                                    name="descricao"
                                    placeholder="Descreva o hotel"
                                    value={form.descricao || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-3 py-2 border ${errors.descricao ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                />
                                {errors.descricao && <div style={{ color: "red", fontWeight: 500 }}>{errors.descricao}</div>}
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

                            {/* CNPJ */}
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
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.cnpj ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.cnpj && <div style={{ color: "red", fontWeight: 500 }}>{errors.cnpj}</div>}
                                </div>

                                {/* Inscrição Estadual */}
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
                        </div>

                        {/* Cadastur */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-[#003194] mb-6">
                                Cadastur
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label htmlFor="numeroCadastur" className="block text-sm font-medium text-[#003194] mb-2">
                                        Cadastur
                                    </label>
                                    <input
                                        type="text"
                                        id="numeroCadastur"
                                        name="numeroCadastur"
                                        placeholder="Ex: ABC123 ou 123456"
                                        value={form.numeroCadastur}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.numeroCadastur ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.numeroCadastur && <div style={{ color: "red", fontWeight: 500 }}>{errors.numeroCadastur}</div>}
                                </div>
                                <div>
                                    <label htmlFor="dataExpiracao" className="block text-sm font-medium text-[#003194] mb-2">
                                        Data de Expiração
                                    </label>
                                    <input
                                        type="date"
                                        id="dataExpiracao"
                                        name="dataExpiracao"
                                        value={form.dataExpiracao}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border ${errors.dataExpiracao ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                                    />
                                    {errors.dataExpiracao && <div style={{ color: "red", fontWeight: 500 }}>{errors.dataExpiracao}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Termos e Condições */}
                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex items-start space-x-3 mb-6 gap-2">
                                <input
                                    type="checkbox"
                                    id="termos"
                                    name="termos"
                                    checked={form.termos}
                                    onChange={handleChange}
                                    className="mt-1 h-4 w-4 text-[#003194] focus:ring-[#003194] border-gray-300 rounded"
                                />

                                <label htmlFor="termos" className="text-lg text-[#003194] leading-relaxed">
                                    Autorizo a Viagium e suas entidades relacionadas a utilizar os meus dados e/ou os de titular para obter informações financeiras comerciais, de crédito e realizar consultas sobre bases de dados necessárias aos serviços solicitados, conforme <a href="/privacy-policy" className="font-bold no-underline hover:text-orange-500" target="_blank">Política de Privacidade da Viagium</a>.
                                </label>
                            </div>

                            {errors.termos && <div style={{ color: "red", fontWeight: 500 }}>{errors.termos}</div>}
                        </div>

                        {/* Botões de ação */}
                        <div className="pt-6 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold text-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                CANCELAR
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-[#003194] text-white rounded-md font-semibold text-lg hover:bg-[#002a7a] transition-colors duration-200"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "ENVIANDO..." : "REGISTRAR HOTEL"}
                            </button>
                        </div>

                        {/* Notificação de sucesso */}
                        {showSuccessNotification && (
                            <div className="fixed top-4 right-4 z-50 transform transition-all duration-500 ease-in-out animate-in slide-in-from-right-5">
                                <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <MdCheck className="h-5 w-5 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                Hotel cadastrado com sucesso!
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                O modal será fechado automaticamente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}; export default ModalHotel;
