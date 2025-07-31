import { useState, useEffect } from "react";
import axios from "axios";
import { validateEmail, validatePassword, validatePhone, validateCEP, validateCNPJ, validateRequired, validateEmailConfirmation, validatePasswordConfirmation, validateFutureDate } from "../../../utils/validations.ts";
import { maskPhone, maskCEP, maskCNPJ, maskInscricaoEstadual, maskCPF, maskPassaporte } from "../../../utils/masks.ts";
import { validateCPF, validatePassaporte } from "../../../utils/validations.ts";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { FaUpload } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdWifi, MdPool, MdLocalParking, MdFitnessCenter, MdRestaurant, MdPets, MdAccessible, MdRoomService, MdAcUnit, MdSpa, MdRestaurantMenu, MdLocalBar, MdRectangle } from "react-icons/md";

interface Hotel {
    id: string;
    name: string;
    location: string;
    status: string;
    image: string;
}

interface ModalEditHotelProps {
    isOpen: boolean;
    onClose: () => void;
    hotel: Hotel | null;
    onSave: (updatedHotel: Hotel) => void;
}

interface Amenity {
    amenityId: number;
    name: string;
    iconName: string;
}

function ModalEditHotel({ isOpen, onClose, hotel, onSave }: ModalEditHotelProps) {
    // Mapeamento dos nomes dos ícones para componentes do react-icons/md
    const getIconComponent = (iconName: string) => {
        const iconMap: { [key: string]: React.ComponentType<any> } = {
            'wifi': MdWifi,
            'pool': MdPool,
            'local_parking': MdLocalParking,
            'fitness_center': MdFitnessCenter,
            'restaurant': MdRestaurant,
            'pets': MdPets,
            'accessible': MdAccessible,
            'room_service': MdRoomService,
            'ac_unit': MdAcUnit,
            'spa': MdSpa,
            'restaurant_menu': MdRestaurantMenu,
            'local_bar': MdLocalBar
        };

        return iconMap[iconName] || MdRectangle; // fallback para um ícone padrão
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
        bairro: "",
        estado: "",
        pais: "",
        telefoneHotel: "",
        imagemHotel: "",
        descricao: "",
        diferenciais: [] as string[],
        cnpj: "",
        inscricaoEstadual: "",
        numeroCadastur: "",
        dataExpiracao: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loadingAmenities, setLoadingAmenities] = useState(false);
    //O que é Cadastur? Interrogation
    const [showCadasturInfo, setShowCadasturInfo] = useState(false);

    // Função para buscar amenities da API
    const fetchAmenities = async () => {
        setLoadingAmenities(true);
        try {
            // Chamada para a API de amenities            
            // Exemplo: 'http://localhost:3001/api/rota'
            const response = await axios.get('https://localhost:5028/api/Amenity/Hotel');
            setAmenities(response.data);
        } catch (error) {
            console.error('Erro ao buscar amenities:', error);
            // Fallback para amenities estáticos em caso de erro da API
            setAmenities([
                {
                    amenityId: 1,
                    name: "Wi-Fi gratuito",
                    iconName: "wifi"
                },
                {
                    amenityId: 2,
                    name: "Piscina",
                    iconName: "pool"
                },
                {
                    amenityId: 3,
                    name: "Estacionamento",
                    iconName: "local_parking"
                },
                {
                    amenityId: 4,
                    name: "Academia",
                    iconName: "fitness_center"
                },
                {
                    amenityId: 5,
                    name: "Café da manhã incluso",
                    iconName: "restaurant"
                },
                {
                    amenityId: 6,
                    name: "Pet friendly",
                    iconName: "pets"
                },
                {
                    amenityId: 7,
                    name: "Acessibilidade",
                    iconName: "accessible"
                },
                {
                    amenityId: 8,
                    name: "Serviço de quarto",
                    iconName: "room_service"
                },
                {
                    amenityId: 9,
                    name: "Ar-condicionado",
                    iconName: "ac_unit"
                },
                {
                    amenityId: 10,
                    name: "Spa",
                    iconName: "spa"
                },
                {
                    amenityId: 11,
                    name: "Restaurante",
                    iconName: "restaurant_menu"
                },
                {
                    amenityId: 12,
                    name: "Bar",
                    iconName: "local_bar"
                }
            ]);
        } finally {
            setLoadingAmenities(false);
        }
    };

    // Carrega amenities quando o modal abre e preenche os dados do hotel
    useEffect(() => {
        if (isOpen) {
            fetchAmenities();
            if (hotel) {
                // Aqui você pode fazer uma chamada para a API para buscar os dados completos do hotel
                // Por enquanto, vamos usar os dados básicos do hotel
                setForm(prev => ({
                    ...prev,
                    nomeHospedagem: hotel.name,
                    imagemHotel: hotel.image,
                    // Preencher outros campos quando dados completos estiverem disponíveis
                }));
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
            case "dataExpiracao":
                if (value && !validateFutureDate(value)) error = "Data inválida.";
                break;
            default:
                if (!validateRequired(value)) error = "Campo obrigatório.";
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};
        // Validação de todos os campos
        if (!validateRequired(form.RazaoSocial)) newErrors.RazaoSocial = "Campo obrigatório.";
        if (!validateRequired(form.NomeFantasia)) newErrors.NomeFantasia = "Campo obrigatório.";
        if (!validatePhone(form.telefone1)) newErrors.telefone1 = "Telefone inválido.";
        if (form.telefone2 && !validatePhone(form.telefone2)) newErrors.telefone2 = "Telefone inválido.";
        if (!validateEmail(form.email)) newErrors.email = "Digite um e-mail válido.";
        const emailConf = validateEmailConfirmation(form.email, form.confirmarEmail);
        if (emailConf) newErrors.confirmarEmail = emailConf;
        const senhaVal = validatePassword(form.senha);
        if (senhaVal) newErrors.senha = senhaVal;
        const senhaConf = validatePasswordConfirmation(form.senha, form.confirmarSenha);
        if (senhaConf) newErrors.confirmarSenha = senhaConf;
        if (!validateRequired(form.nomeHospedagem)) newErrors.nomeHospedagem = "Campo obrigatório.";
        if (!validateRequired(form.tipo)) newErrors.tipo = "Campo obrigatório.";
        if (!validateCEP(form.cep)) newErrors.cep = "CEP inválido.";
        if (!validateRequired(form.rua)) newErrors.rua = "Campo obrigatório.";
        if (!validateRequired(form.bairro)) newErrors.bairro = "Campo obrigatório.";
        if (!validateRequired(form.estado)) newErrors.estado = "Campo obrigatório.";
        if (!validateRequired(form.pais)) newErrors.pais = "Campo obrigatório.";
        if (!validateRequired(form.imagemHotel)) newErrors.imagemHotel = "Campo obrigatório.";
        if (!validateRequired(form.descricao)) newErrors.descricao = "Campo obrigatório.";
        if (!validateCNPJ(form.cnpj)) newErrors.cnpj = "CNPJ inválido.";
        if (!validateRequired(form.inscricaoEstadual)) newErrors.inscricaoEstadual = "Campo obrigatório.";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        
        // Se chegou até aqui, salva as alterações
        if (hotel) {
            const updatedHotel: Hotel = {
                ...hotel,
                name: form.nomeHospedagem,
                image: form.imagemHotel
            };
            onSave(updatedHotel);
        }
        alert("Hotel atualizado com sucesso!");
        onClose(); // Fecha o modal após sucesso
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

                        {/* Dados da hospedagem */}
                        <div className="pt-6">
                            <h3 className="text-2xl font-semibold text-[#003194] mb-6">Dados do Hotel</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="nomeHospedagem" className="block text-sm font-medium text-[#003194] mb-2">
                                        Nome da hospedagem
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
                                        Tipo
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

                            {/* CEP */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="cep" className="block text-sm font-medium text-[#003194] mb-2">
                                        CEP
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
                                        Rua
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

                            {/* Bairro */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label htmlFor="bairro" className="block text-sm font-medium text-[#003194] mb-2">
                                        Bairro
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

                                {/* Estado */}
                                <div>
                                    <label htmlFor="estado" className="block text-sm font-medium text-[#003194] mb-2">
                                        Estado
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
                                        País
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

                            {/* Telefone Hotel e ImagemURL advinda do computador   */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* DIV Telefone */}
                                <div className="mb-4 mt-4">
                                    <label htmlFor="telefoneHotel" className="block text-sm font-medium text-[#003194] mb-2">
                                        Telefone
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

                                <div className="mb-4 flex flex-col items-center w-full">
                                    <label
                                        htmlFor="imagemHotel"
                                        className={`w-full flex flex-col items-center justify-center px-3 py-6 border-2 border-dotted cursor-pointer transition-colors duration-150 ${errors.imagemHotel ? 'border-red-500' : 'border-gray-300'
                                            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent text-center`}
                                        style={{ textAlign: "center" }}
                                    >
                                        <FaUpload className="text-[#003194] text-3xl mb-2" />
                                        <span className="block text-sm font-medium text-[#003194] mb-2 text-center">
                                            Imagem do hotel
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
                            </div>

                            {/* Descricao */}
                            <div className="mb-4">
                                <label htmlFor="descricao" className="block text-sm font-medium text-[#003194] mb-2">
                                    Descrição do hotel
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
                                        CNPJ
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
                                        Inscrição Estadual
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

                        {/* Seção Cadastur */}
                        <div>
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
                                    <label className="block text-sm font-medium text-[#003194] mb-2">
                                        Número Cadastur
                                    </label>
                                    <input
                                        type="text"
                                        name="numeroCadastur"
                                        value={form.numeroCadastur}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] bg-gray-100 cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#003194] mb-2">
                                        Data de Expiração
                                    </label>
                                    <input
                                        type="date"
                                        name="dataExpiracao"
                                        value={form.dataExpiracao}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] ${
                                            errors.dataExpiracao ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.dataExpiracao && (
                                        <div style={{ color: "red", fontWeight: 500 }}>{errors.dataExpiracao}</div>
                                    )}
                                </div>
                            </div>
                        </div>



                        {/* Botões de ação */}
                        <div className="pt-10 flex justify-center gap-4">
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
                            >
                                SALVAR ALTERAÇÕES
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalEditHotel;
