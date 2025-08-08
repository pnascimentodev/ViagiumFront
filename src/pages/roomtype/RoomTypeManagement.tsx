"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { FaUsers, FaEllipsisV, FaEdit, FaPowerOff, FaPlus, FaSearch, FaBed, FaDollarSign, FaHashtag, FaArrowLeft, FaTimes, FaUpload } from "react-icons/fa"
import * as Md from "react-icons/md"
import {
    MdBathtub,
    MdBalcony,
    MdWaves,
    MdBed as MdBedIcon,
    MdWeekend,
    MdDesk,
    MdLock,
    MdBlender,
    MdCheckroom,
    MdAccessible,
    MdHearing,
    MdPower,
    MdKitchen,
    MdMicrowave,
    MdFlatware,
    MdSmartDisplay,
    MdCurtains,
    MdThermostat,
    MdVoiceChat,
    MdLight,
    MdShower,
    MdCoffee,
    MdAir,
    MdCreditCard,
    MdDining,
    MdPool,
    MdChildFriendly,
    MdRectangle,
    MdElectricMeter,
} from "react-icons/md"
import { useNavigate } from "react-router-dom"
import apiClient from "../../utils/apiClient"
import { AuthService } from "../../utils/auth"

// Interface para os adicionais vindos da API
interface Amenity {
    amenityId: number
    name: string
    iconName: string
}

// Mapeamento dos ícones do Material Design
const iconMap: Record<string, React.ComponentType<any>> = {
    MdBathtub,
    MdBalcony,
    MdWaves,
    MdBed: MdBedIcon,
    MdWeekend,
    MdDesk,
    MdElectricKettle: MdElectricMeter, // Fallback para chaleira elétrica
    MdLock,
    MdMirror: MdRectangle, // Fallback para espelho
    MdBlender,
    MdCheckroom,
    MdAccessible,
    MdHearing,
    MdPower,
    MdKitchen,
    MdMicrowave,
    MdFlatware,
    MdFridge: MdKitchen, // Fallback para geladeira
    MdSmartDisplay,
    MdCurtains,
    MdThermostat,
    MdVoiceChat,
    MdLight,
    MdShower,
    MdCoffee,
    MdAir,
    MdCreditCard,
    MdDining,
    MdPool,
    MdChildFriendly,
}

// Componente para renderizar ícone dinamicamente
const DynamicIcon = ({ iconName, size = 16, style }: { iconName: string; size?: number; style?: React.CSSProperties }) => {
    // Acessa o ícone dinamicamente do namespace Md
    const IconComponent = (Md as any)[iconName];

    if (!IconComponent) {
        return <Md.MdWifi size={size} style={style} />;
    }

    return <IconComponent size={size} style={style} />;
};

// Interface para os tipos de quarto (atualizada para refletir a API)
interface RoomType {
    roomTypeId: number
    hotelId: number
    name: string
    description: string
    imageUrl: string
    pricePerNight: number
    maxOccupancy: number
    numberOfRoomsAvailable: number
    numberOfRoomsReserved: number // Mock - não vem da API ainda
    actualAvailableRooms?: number // Mock - quartos realmente disponíveis (não reservados)
    createdAt: string
    isActive: boolean
    deletedAt: string | null
    rooms: any[]
    amenities: Array<{
        amenityId: number
        name: string
        iconName: string
    }>
}

export default function RoomTypeManagement() {
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
    const [filteredRoomTypes, setFilteredRoomTypes] = useState<RoomType[]>([])
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    // Estados para o modal de edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null)
    const [amenities, setAmenities] = useState<Amenity[]>([])
    const [loadingAmenities, setLoadingAmenities] = useState(false)

    // Buscar dados da API no carregamento
    useEffect(() => {
        fetchRoomTypes();
    }, []);

    const fetchRoomTypes = async () => {
        try {
            setLoading(true);

            // Verifica se está autenticado
            if (!AuthService.isAffiliateAuthenticated()) {
                navigate('/affiliate');
                return;
            }

            // Recupera os dados de autenticação do afiliado
            const affiliateAuth = AuthService.getAffiliateAuth();
            if (!affiliateAuth || !affiliateAuth.id) {
                console.error('Dados de autenticação do afiliado não encontrados');
                navigate('/affiliate');
                return;
            }

            // Verifica se há um hotelId específico na URL
            const urlParams = new URLSearchParams(window.location.search);
            const hotelIdParam = urlParams.get('hotelId');

            if (hotelIdParam) {
                // Se há um hotelId específico, busca os room types diretamente do hotel
                const hotelId = parseInt(hotelIdParam);
                console.log('Buscando room types do hotel:', hotelId);

                try {
                    const hotelResponse = await apiClient.get(`https://viagium.azurewebsites.net/api/Hotel/${hotelId}`);

                    // Verificar se o hotel pertence ao afiliado logado
                    if (hotelResponse.data.affiliateId !== parseInt(affiliateAuth.id)) {
                        console.warn(`Hotel ${hotelId} não pertence ao afiliado logado`);
                        alert('Você não tem permissão para acessar os quartos deste hotel.');
                        navigate('/affiliatedashboard');
                        return;
                    }

                    // Extrair os room types do hotel
                    const roomTypesFromHotel = hotelResponse.data.roomTypes || [];
                    console.log(`Room types encontrados para o hotel ${hotelId}:`, roomTypesFromHotel.length);

                    // Adiciona dados mockados para campos não disponíveis na API
                    const roomTypesWithMockData = roomTypesFromHotel.map((roomType: any) => {
                        const totalRooms = roomType.numberOfRoomsAvailable || 5;
                        // Mock para quartos reservados - entre 0% e 70% dos quartos disponíveis
                        const numberOfRoomsReserved = Math.floor(totalRooms * Math.random() * 0.7);
                        // Calcular quartos realmente disponíveis (não reservados)
                        const actualAvailableRooms = totalRooms - numberOfRoomsReserved;

                        return {
                            ...roomType,
                            numberOfRoomsReserved,
                            actualAvailableRooms
                        };
                    });

                    setRoomTypes(roomTypesWithMockData);
                    setFilteredRoomTypes(roomTypesWithMockData);

                } catch (hotelError) {
                    console.error(`Erro ao buscar dados do hotel ${hotelId}:`, hotelError);
                    if ((hotelError as any)?.response?.status === 404) {
                        alert('Hotel não encontrado.');
                    } else {
                        alert('Erro ao carregar dados do hotel. Tente novamente.');
                    }
                    navigate('/affiliatedashboard');
                    return;
                }

            } else {
                // Se não há hotelId específico, busca dados do afiliado para mostrar todos os room types dos seus hotéis
                try {
                    const affiliateResponse = await apiClient.get(`/Affiliate/${affiliateAuth.id}`);

                    if (!affiliateResponse.data || !affiliateResponse.data.hotels || !Array.isArray(affiliateResponse.data.hotels)) {
                        console.error('Afiliado não possui hotéis cadastrados');
                        setRoomTypes([]);
                        setFilteredRoomTypes([]);
                        return;
                    }

                    // Buscar room types de todos os hotéis do afiliado
                    const allRoomTypes: any[] = [];

                    for (const hotel of affiliateResponse.data.hotels) {
                        try {
                            const hotelResponse = await apiClient.get(`https://viagium.azurewebsites.net/api/Hotel/${hotel.hotelId}`);
                            const roomTypesFromHotel = hotelResponse.data.roomTypes || [];
                            allRoomTypes.push(...roomTypesFromHotel);
                        } catch (error) {
                            console.warn(`Erro ao buscar room types do hotel ${hotel.hotelId}:`, error);
                            // Continuar com os outros hotéis mesmo se um falhar
                        }
                    }

                    console.log(`Total de room types de todos os hotéis do afiliado: ${allRoomTypes.length}`);

                    // Adiciona dados mockados para campos não disponíveis na API
                    const roomTypesWithMockData = allRoomTypes.map((roomType: any) => {
                        const totalRooms = roomType.numberOfRoomsAvailable || 5;
                        // Mock para quartos reservados - entre 0% e 70% dos quartos disponíveis
                        const numberOfRoomsReserved = Math.floor(totalRooms * Math.random() * 0.7);
                        // Calcular quartos realmente disponíveis (não reservados)
                        const actualAvailableRooms = totalRooms - numberOfRoomsReserved;

                        return {
                            ...roomType,
                            numberOfRoomsReserved,
                            actualAvailableRooms
                        };
                    });

                    setRoomTypes(roomTypesWithMockData);
                    setFilteredRoomTypes(roomTypesWithMockData);

                } catch (affiliateError) {
                    console.error('Erro ao buscar dados do afiliado:', affiliateError);
                    alert('Erro ao carregar dados do afiliado. Tente novamente.');
                    navigate('/affiliatedashboard');
                    return;
                }
            }

        } catch (error) {
            console.error('Erro ao buscar tipos de quarto:', error);
            // Se der erro de autenticação, redireciona
            if ((error as any)?.response?.status === 401) {
                AuthService.clearAffiliateAuth();
                navigate('/affiliate');
            }
        } finally {
            setLoading(false);
        }
    };

    // Filtrar tipos de quarto baseado no status e termo de busca
    useEffect(() => {
        let filtered = roomTypes

        // Filtro por status
        if (statusFilter === "active") {
            filtered = filtered.filter((room) => room.isActive)
        } else if (statusFilter === "inactive") {
            filtered = filtered.filter((room) => !room.isActive)
        }

        // Filtro por termo de busca
        if (searchTerm) {
            filtered = filtered.filter(
                (room) =>
                    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    room.description.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        setFilteredRoomTypes(filtered)
    }, [roomTypes, statusFilter, searchTerm])

    const handleToggleStatus = async (roomTypeId: number) => {
        try {
            const roomType = roomTypes.find(r => r.roomTypeId === roomTypeId);
            if (!roomType) return;

            if (roomType.isActive) {
                // Desativar: chama DELETE /api/roomtype/{id}
                await apiClient.delete(`https://viagium.azurewebsites.netapi/roomtype/${roomTypeId}`);

                // Atualiza o estado local
                setRoomTypes((prev) => prev.map((room) =>
                    room.roomTypeId === roomTypeId ? { ...room, isActive: false } : room
                ));

                console.log(`Tipo de quarto ${roomTypeId} desativado com sucesso`);
            } else {
                // Ativar: chama POST /api/roomtype/{id}/activate
                await apiClient.post(`https://viagium.azurewebsites.net/api/roomtype/${roomTypeId}/activate`, {});

                // Atualiza o estado local
                setRoomTypes((prev) => prev.map((room) =>
                    room.roomTypeId === roomTypeId ? { ...room, isActive: true } : room
                ));

                console.log(`Tipo de quarto ${roomTypeId} ativado com sucesso`);
            }
        } catch (error) {
            console.error('Erro ao alterar status do tipo de quarto:', error);
            alert('Erro ao alterar status do tipo de quarto. Tente novamente.');
        } finally {
            setActiveDropdown(null);
        }
    }

    const handleEdit = async (roomTypeId: number) => {
        const roomType = roomTypes.find(r => r.roomTypeId === roomTypeId);
        if (roomType) {
            setEditingRoomType(roomType);
            // Buscar amenities se ainda não foram carregadas
            if (amenities.length === 0) {
                await fetchAmenities();
            }
            setIsEditModalOpen(true);
        }
        setActiveDropdown(null);
    }

    // Função para buscar amenities
    const fetchAmenities = async () => {
        try {
            setLoadingAmenities(true);
            const response = await fetch('https://viagium.azurewebsites.net/api/Amenity/TypeRoom');
            if (response.ok) {
                const data = await response.json();
                setAmenities(data);
            }
        } catch (error) {
            console.error('Erro ao buscar amenities:', error);
        } finally {
            setLoadingAmenities(false);
        }
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingRoomType(null);
    }

    const handleNewRoomType = () => {
        navigate("/roomtype");
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const handleDropdownClick = (roomTypeId: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setActiveDropdown(activeDropdown === roomTypeId ? null : roomTypeId)
    }

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveDropdown(null)
        }
        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-600"></div>
            </div>
        )
    }

    // Componente do Modal de Edição
    const EditRoomTypeModal = () => {
        if (!isEditModalOpen || !editingRoomType) return null;

        return (
            <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Editar Tipo de Quarto</h2>
                        <button
                            onClick={handleCloseEditModal}
                            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <EditRoomTypeForm roomType={editingRoomType} onClose={handleCloseEditModal} onUpdate={fetchRoomTypes} />
                </div>
            </div>
        );
    };

    // Componente do Formulário de Edição
    const EditRoomTypeForm = ({ roomType, onClose, onUpdate }: {
        roomType: RoomType;
        onClose: () => void;
        onUpdate: () => void;
    }) => {
        const [form, setForm] = useState({
            name: roomType.name,
            description: roomType.description,
            pricePerNight: roomType.pricePerNight.toString(),
            maxOccupancy: roomType.maxOccupancy.toString(),
            numberOfRoomsAvailable: roomType.numberOfRoomsAvailable.toString(),
            imageUrl: roomType.imageUrl,
        });

        const [displayPrice, setDisplayPrice] = useState(() => {
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(roomType.pricePerNight);
        });

        const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
            roomType.amenities.map(a => a.amenityId)
        );

        const [roomNumbers, setRoomNumbers] = useState<string[]>(
            roomType.rooms.map((room: any) => room.roomNumber.toString())
        );

        const [errors, setErrors] = useState<{ [key: string]: string }>({});
        const [isSubmitting, setIsSubmitting] = useState(false);

        // Estados para paginação dos diferenciais
        const [currentAmenitiesPage, setCurrentAmenitiesPage] = useState(0);
        const [activeTab, setActiveTab] = useState("manual"); // Estado para controlar a aba ativa (range ou manual)

        // Estados para geração automática de números
        const [startNumber, setStartNumber] = useState("");
        const [endNumber, setEndNumber] = useState("");
        const [currentRoomNumber, setCurrentRoomNumber] = useState("");
        const [rangeError, setRangeError] = useState<string | null>(null);

        // Estados para upload de imagem
        const [selectedImage, setSelectedImage] = useState<File | null>(null);
        const [uploadingImage, setUploadingImage] = useState(false);
        const [uploadError, setUploadError] = useState<string | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);

        // Constantes para paginação dos adicionais
        const ITEMS_PER_PAGE = 9; // 3 colunas x 3 itens
        const totalAmenitiesPages = Math.ceil(amenities.length / ITEMS_PER_PAGE);
        const startIndex = currentAmenitiesPage * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentPageAmenities = amenities.slice(startIndex, endIndex);

        // Função para ir para a próxima página de diferenciais
        function goToNextAmenitiesPage() {
            if (currentAmenitiesPage < totalAmenitiesPages - 1) {
                setCurrentAmenitiesPage(currentAmenitiesPage + 1);
            }
        }

        // Função para ir para a página anterior de diferenciais
        function goToPrevAmenitiesPage() {
            if (currentAmenitiesPage > 0) {
                setCurrentAmenitiesPage(currentAmenitiesPage - 1);
            }
        }

        // Função para validar campos obrigatórios
        const validateForm = () => {
            const newErrors: { [key: string]: string } = {};

            if (!form.name.trim()) {
                newErrors.name = 'Nome é obrigatório';
            }

            if (!form.description.trim()) {
                newErrors.description = 'Descrição é obrigatória';
            }

            if (!form.pricePerNight || parseFloat(form.pricePerNight) <= 0) {
                newErrors.pricePerNight = 'Preço deve ser maior que zero';
            }

            if (!form.maxOccupancy || parseInt(form.maxOccupancy) <= 0) {
                newErrors.maxOccupancy = 'Ocupação máxima deve ser maior que zero';
            }

            if (!form.numberOfRoomsAvailable || parseInt(form.numberOfRoomsAvailable) <= 0) {
                newErrors.numberOfRoomsAvailable = 'Número de quartos deve ser maior que zero';
            }

            if (roomNumbers.length === 0) {
                newErrors.roomNumbers = 'Deve haver pelo menos um número de quarto';
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setForm(prev => ({ ...prev, [name]: value }));

            // Limpar erro do campo quando usuário começar a digitar
            if (errors[name]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;

            // Validação no blur (quando sai do campo)
            if (!value.trim() && name !== 'imageUrl') {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'Este campo é obrigatório'
                }));
            }
        };

        const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;

            // Remove tudo que não é dígito
            const cleanValue = inputValue.replace(/\D/g, '');

            if (cleanValue === '') {
                setDisplayPrice('');
                setForm(prev => ({ ...prev, pricePerNight: '' }));
                return;
            }

            // Converte para número e divide por 100 para ter centavos
            const numValue = parseInt(cleanValue) / 100;

            // Formata para exibição
            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(numValue);

            setDisplayPrice(formatted);
            setForm(prev => ({ ...prev, pricePerNight: numValue.toString() }));

            // Limpar erro de preço
            if (errors.pricePerNight) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.pricePerNight;
                    return newErrors;
                });
            }
        };

        const toggleAmenity = (amenityId: number) => {
            setSelectedAmenities(prev =>
                prev.includes(amenityId)
                    ? prev.filter(id => id !== amenityId)
                    : [...prev, amenityId]
            );
        };

        const removeAmenity = (amenityToRemove: number) => {
            setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityToRemove));
        };

        // Função para Geração automática de números de quartos por intervalo
        function generateRangeNumbers() {
            if (!startNumber || !endNumber) return;

            const start = parseInt(startNumber);
            const end = parseInt(endNumber);

            if (start >= end) return;

            const rangeCount = (end - start) + 1;
            const maxRooms = form.numberOfRoomsAvailable ? parseInt(form.numberOfRoomsAvailable) : null;

            if (maxRooms && maxRooms > 0) {
                if (rangeCount > maxRooms) {
                    setRangeError(`Não é possível gerar ${rangeCount} quartos. O limite é ${maxRooms} quartos disponíveis.`);
                    return;
                }

                if (rangeCount < maxRooms) {
                    setRangeError(`Você deve cadastrar exatamente ${maxRooms} números de quartos. Faltam ${maxRooms - rangeCount} quarto(s).`);
                    return;
                }

                if (roomNumbers.length + rangeCount > maxRooms) {
                    const quartosRestantes = maxRooms - roomNumbers.length;
                    setRangeError(`Você já tem ${roomNumbers.length} quartos adicionados. Só pode adicionar mais ${quartosRestantes} quarto(s).`);
                    return;
                }
            }

            const newNumbers: string[] = [];
            for (let i = start; i <= end; i++) {
                newNumbers.push(i.toString());
            }

            setRoomNumbers(newNumbers);
            setStartNumber("");
            setEndNumber("");
            setRangeError(null);
        }

        function addRoomNumber() {
            if (!currentRoomNumber.trim()) return;
            if (roomNumbers.includes(currentRoomNumber.trim())) return;

            const maxRooms = form.numberOfRoomsAvailable ? parseInt(form.numberOfRoomsAvailable) : null;

            if (maxRooms && maxRooms > 0) {
                if (roomNumbers.length >= maxRooms) {
                    return;
                }
            }

            const newRoomNumbers = [...roomNumbers, currentRoomNumber.trim()];
            setRoomNumbers(newRoomNumbers);
            setCurrentRoomNumber("");
        }

        function removeRoomNumber(numberToRemove: string) {
            const newRoomNumbers = roomNumbers.filter((num) => num !== numberToRemove);
            setRoomNumbers(newRoomNumbers);
        }

        function clearAllRooms() {
            setRoomNumbers([]);
        }

        function handleKeyPress(e: React.KeyboardEvent) {
            if (e.key === "Enter") {
                e.preventDefault();
                addRoomNumber();
            }
        }

        // Funções para upload de imagem
        function handleImageButtonClick() {
            fileInputRef.current?.click();
        }

        function validateImageFile(file: File): string | null {
            const maxSize = 5 * 1024 * 1024; // 5MB em bytes
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

            if (!allowedTypes.includes(file.type)) {
                return 'Formato não suportado. Use apenas PNG ou JPG.';
            }

            if (file.size > maxSize) {
                return 'Arquivo muito grande. Máximo 5MB.';
            }

            return null;
        }

        async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
            const file = event.target.files?.[0];
            setUploadError(null);

            if (!file) return;

            // Validar arquivo
            const validationError = validateImageFile(file);
            if (validationError) {
                setUploadError(validationError);
                return;
            }

            // Iniciar processo de upload
            setUploadingImage(true);

            try {
                // Simular delay de upload
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Armazenar arquivo selecionado após "upload"
                setSelectedImage(file);
                setUploadError(null);

            } catch (error) {
                console.error('Erro no upload:', error);
                setUploadError('Erro ao fazer upload da imagem. Tente novamente.');
                setSelectedImage(null);
            } finally {
                setUploadingImage(false);
            }
        }

        function removeSelectedImage() {
            setSelectedImage(null);
            setUploadError(null);
            setUploadingImage(false);

            // Limpar input file
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            setIsSubmitting(true);

            try {
                // Verificar se há números de quartos suficientes
                const expectedRooms = parseInt(form.numberOfRoomsAvailable);
                if (roomNumbers.length !== expectedRooms) {
                    alert(`Você deve cadastrar exatamente ${expectedRooms} números de quartos. Atualmente há ${roomNumbers.length}.`);
                    setIsSubmitting(false);
                    return;
                }

                console.log('Dados do formulário:', {
                    roomTypeId: roomType.roomTypeId,
                    name: form.name,
                    description: form.description,
                    pricePerNight: form.pricePerNight,
                    maxOccupancy: form.maxOccupancy,
                    numberOfRoomsAvailable: form.numberOfRoomsAvailable,
                    selectedAmenities,
                    roomNumbers,
                    hasImage: !!selectedImage
                });

                // Se há imagem nova, usar FormData
                if (selectedImage) {
                    const formData = new FormData();

                    // Seguir a estrutura exata da API
                    formData.append('roomTypeId', roomType.roomTypeId.toString());
                    formData.append('hotelId', roomType.hotelId.toString());
                    formData.append('name', form.name);
                    formData.append('description', form.description);
                    formData.append('imageUrl', form.imageUrl || ''); // URL atual caso não tenha imagem nova
                    formData.append('pricePerNight', form.pricePerNight);
                    formData.append('maxOccupancy', form.maxOccupancy);
                    formData.append('numberOfRoomsAvailable', form.numberOfRoomsAvailable);

                    // Adicionar a imagem
                    formData.append('image', selectedImage);

                    console.log('Enviando FormData com imagem...');
                    console.log('FormData contents:');
                    for (let pair of formData.entries()) {
                        console.log(pair[0] + ': ' + pair[1]);
                    }

                    // Usar PUT como mostra na documentação
                    await apiClient.put(`https://viagium.azurewebsites.net/api/roomtype/${roomType.roomTypeId}`, formData);
                } else {
                    // Se não há imagem nova, usar JSON
                    console.log('Enviando JSON sem imagem...');

                    const jsonData = {
                        roomTypeId: roomType.roomTypeId,
                        hotelId: roomType.hotelId,
                        name: form.name,
                        description: form.description,
                        imageUrl: form.imageUrl || '',
                        pricePerNight: parseFloat(form.pricePerNight),
                        maxOccupancy: parseInt(form.maxOccupancy),
                        numberOfRoomsAvailable: parseInt(form.numberOfRoomsAvailable)
                    };

                    console.log('Dados JSON:', jsonData);

                    await apiClient.put(`https://viagium.azurewebsites.net/api/roomtype`, jsonData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }

                alert('Tipo de quarto atualizado com sucesso!');
                onUpdate(); // Atualiza a lista de room types
                onClose(); // Fecha o modal

            } catch (error: any) {
                console.error('Erro completo:', error);
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
                console.error('Response headers:', error.response?.headers);

                let errorMessage = 'Erro ao atualizar tipo de quarto. Tente novamente.';

                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response?.data?.errors) {
                    const errors = Object.values(error.response.data.errors).flat();
                    errorMessage = errors.join(', ');
                } else if (error.response?.status === 400) {
                    errorMessage = 'Dados inválidos. Verifique os campos obrigatórios.';
                } else if (error.response?.status === 401) {
                    errorMessage = 'Não autorizado. Faça login novamente.';
                } else if (error.response?.status === 404) {
                    errorMessage = 'Tipo de quarto não encontrado.';
                }

                alert(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Campos principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 flex flex-col gap-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Nome do Tipo de Quarto *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Ex: Quarto Standard Duplo"
                                value={form.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.name && <div className="text-red-500 text-sm font-medium">{errors.name}</div>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Descrição *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Descreva as características e comodidades do quarto..."
                                value={form.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[230px] resize-none"
                            />
                            {errors.description && <div className="text-red-500 text-sm font-medium">{errors.description}</div>}
                        </div>
                    </div>

                    <div className="space-y-4 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="price" className="text-sm font-medium text-gray-700">
                                    Preço por Noite (R$) *
                                </label>
                                <input
                                    type="text"
                                    id="price"
                                    name="pricePerNight"
                                    placeholder="R$ 0,00"
                                    value={displayPrice}
                                    onChange={handlePriceChange}
                                    onBlur={handleBlur}
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.pricePerNight && <div className="text-red-500 text-sm font-medium">{errors.pricePerNight}</div>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="maxOccupancy" className="text-sm font-medium text-gray-700">
                                    <FaUsers className="w-4 h-4 inline mr-1" />
                                    Ocupação Máxima *
                                </label>
                                <input
                                    type="number"
                                    id="maxOccupancy"
                                    name="maxOccupancy"
                                    placeholder="Número de pessoas"
                                    value={form.maxOccupancy}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.maxOccupancy && <div className="text-red-500 text-sm font-medium">{errors.maxOccupancy}</div>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="numberOfRoomsAvailable" className="text-sm font-medium text-gray-700">
                                Número de Quartos Disponíveis *
                            </label>
                            <input
                                type="number"
                                id="numberOfRoomsAvailable"
                                name="numberOfRoomsAvailable"
                                placeholder="15"
                                value={form.numberOfRoomsAvailable}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.numberOfRoomsAvailable && <div className="text-red-500 text-sm font-medium">{errors.numberOfRoomsAvailable}</div>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Imagem do Quarto</label>

                            {/* Input de arquivo oculto */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={handleImageSelect}
                                className="hidden"
                            />

                            {/* Área de upload/preview */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors h-[150px] flex flex-col items-center justify-center">
                                {selectedImage ? (
                                    // Arquivo selecionado - mostra apenas o nome
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <FaUpload className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm font-medium text-gray-700">
                                                {selectedImage.name}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                type="button"
                                                onClick={handleImageButtonClick}
                                                disabled={uploadingImage}
                                                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                            >
                                                Trocar Arquivo
                                            </button>
                                            <button
                                                type="button"
                                                onClick={removeSelectedImage}
                                                disabled={uploadingImage}
                                                className="px-3 py-1 text-sm border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Estado inicial - sem arquivo  
                                    <>
                                        <FaUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <button
                                            type="button"
                                            onClick={handleImageButtonClick}
                                            disabled={uploadingImage}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1 disabled:opacity-50"
                                        >
                                            {uploadingImage ? 'Enviando...' : 'Selecionar Imagem'}
                                        </button>
                                        <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                                    </>
                                )}

                                {/* Indicador de upload */}
                                {uploadingImage && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            <span className="text-sm text-blue-600">Enviando imagem...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Mensagem de erro */}
                                {uploadError && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-sm text-red-600">{uploadError}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Diferenciais do Quarto */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-lg font-semibold text-gray-900">Diferenciais do Quarto</label>
                        <span className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-50">
                            {selectedAmenities.length} selecionados
                        </span>
                    </div>

                    <div className="bg-white">
                        <div className="space-y-4 flex flex-col gap-4">
                            <h4 className="font-medium text-sm text-gray-600">
                                {loadingAmenities ? "Carregando diferenciais..." : "Selecione os diferenciais disponíveis:"}
                            </h4>

                            {loadingAmenities ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 animate-pulse">
                                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                            <div className="h-4 bg-gray-300 rounded flex-1"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {currentPageAmenities.map((amenity) => {
                                            const IconComponent = iconMap[amenity.iconName] || MdBedIcon;
                                            const isSelected = selectedAmenities.includes(amenity.amenityId);

                                            return (
                                                <div
                                                    key={amenity.amenityId}
                                                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 gap-3 ${isSelected
                                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                                            : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                    onClick={() => toggleAmenity(amenity.amenityId)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleAmenity(amenity.amenityId)}
                                                        className="pointer-events-none w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <IconComponent className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                                                    <span className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                                                        {amenity.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {totalAmenitiesPages > 1 && (
                                        <div className="flex items-center justify-between pt-4">
                                            <button
                                                type="button"
                                                onClick={goToPrevAmenitiesPage}
                                                disabled={currentAmenitiesPage === 0}
                                                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Anterior
                                            </button>

                                            <span className="text-sm text-gray-600">
                                                Página {currentAmenitiesPage + 1} de {totalAmenitiesPages}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={goToNextAmenitiesPage}
                                                disabled={currentAmenitiesPage >= totalAmenitiesPages - 1}
                                                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Próxima
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {selectedAmenities.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm text-gray-600">Diferenciais selecionados:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAmenities.map((amenityId, index) => {
                                            const amenity = amenities.find((a) => a.amenityId === amenityId);
                                            const IconComponent = amenity ? (iconMap[amenity.iconName] || MdBedIcon) : MdBedIcon;

                                            return (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200"
                                                >
                                                    <IconComponent className="w-3 h-3" />
                                                    {amenity?.name || 'Diferencial não encontrado'}
                                                    <button
                                                        type="button"
                                                        className="ml-1 w-4 h-4 flex items-center justify-center hover:bg-blue-300 hover:text-blue-900 rounded"
                                                        onClick={() => removeAmenity(amenityId)}
                                                    >
                                                        <FaTimes className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Números dos Quartos */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-lg font-semibold text-gray-900">Números dos Quartos *</label>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-50">
                                {roomNumbers.length} de {form.numberOfRoomsAvailable} quartos
                            </span>
                            {roomNumbers.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearAllRooms}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center"
                                >
                                    <FaTimes className="w-4 h-4 mr-1" />
                                    Limpar Todos
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="flex border-b border-gray-200">
                            <button
                                type="button"
                                onClick={() => setActiveTab("range")}
                                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "range"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <FaHashtag className="w-4 h-4" />
                                Vários Quartos de Uma Vez
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("manual")}
                                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "manual"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <FaPlus className="w-4 h-4" />
                                Individual
                            </button>
                        </div>

                        <div className="mt-4">
                            {activeTab === "range" && (
                                <div className="space-y-4">
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <FaHashtag className="w-4 h-4" />
                                                Gerar Números de Quartos
                                            </h3>
                                            <div className="grid grid-cols-3 gap-3 items-end">
                                                <div className="space-y-2">
                                                    <label className="text-sm text-gray-700">Número Inicial</label>
                                                    <input
                                                        value={startNumber}
                                                        onChange={(e) => {
                                                            setStartNumber(e.target.value);
                                                            setRangeError(null);
                                                        }}
                                                        placeholder="101"
                                                        type="number"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm text-gray-700">Número Final</label>
                                                    <input
                                                        value={endNumber}
                                                        onChange={(e) => {
                                                            setEndNumber(e.target.value);
                                                            setRangeError(null);
                                                        }}
                                                        placeholder="115"
                                                        type="number"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={generateRangeNumbers}
                                                    disabled={
                                                        !startNumber ||
                                                        !endNumber ||
                                                        Boolean(form.numberOfRoomsAvailable &&
                                                            !isNaN(parseInt(form.numberOfRoomsAvailable)) &&
                                                            parseInt(form.numberOfRoomsAvailable) > 0 &&
                                                            roomNumbers.length >= parseInt(form.numberOfRoomsAvailable))
                                                    }
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Gerar Intervalo
                                                </button>
                                            </div>

                                            {rangeError ? (
                                                <p className="text-sm text-red-600 font-medium mt-3">
                                                    ⚠️ {rangeError}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-500 mt-3">
                                                    Ex: De 101 até 115 gerará: 101, 102, 103... 115
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "manual" && (
                                <div className="space-y-4">
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <FaPlus className="w-4 h-4" />
                                                Adicionar Número de Quarto
                                            </h3>
                                            <div className="flex gap-2">
                                                <input
                                                    value={currentRoomNumber}
                                                    onChange={(e) => setCurrentRoomNumber(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Ex: 101"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addRoomNumber}
                                                    disabled={
                                                        !currentRoomNumber.trim() ||
                                                        roomNumbers.includes(currentRoomNumber.trim()) ||
                                                        Boolean(form.numberOfRoomsAvailable &&
                                                            !isNaN(parseInt(form.numberOfRoomsAvailable)) &&
                                                            parseInt(form.numberOfRoomsAvailable) > 0 &&
                                                            roomNumbers.length >= parseInt(form.numberOfRoomsAvailable))
                                                    }
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                                >
                                                    <FaPlus className="w-4 h-4 mr-1" />
                                                    Adicionar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {roomNumbers.length > 0 && (
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm text-gray-600">Números de Quartos Adicionados:</h4>
                                <div className="flex flex-wrap gap-3 max-h-32 overflow-y-auto">
                                    {roomNumbers.map((number, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-md text-sm font-medium"
                                        >
                                            Quarto nº {number}
                                            <button
                                                type="button"
                                                className="ml-1 w-4 h-4 flex items-center justify-center hover:bg-red-600 hover:text-white rounded"
                                                onClick={() => removeRoomNumber(number)}
                                            >
                                                <FaTimes className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                {form.numberOfRoomsAvailable &&
                                    !isNaN(parseInt(form.numberOfRoomsAvailable)) &&
                                    parseInt(form.numberOfRoomsAvailable) > 0 &&
                                    roomNumbers.length >= parseInt(form.numberOfRoomsAvailable) && (
                                        <p className="text-sm text-amber-600 font-medium">
                                            Limite atingido! Todos os {form.numberOfRoomsAvailable} quartos foram adicionados.
                                        </p>
                                    )}

                                {rangeError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-sm text-red-600 font-medium">
                                            ⚠️ {rangeError}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {errors.roomNumbers && <div className="text-red-500 text-sm font-medium">{errors.roomNumbers}</div>}
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Salvando...
                            </div>
                        ) : (
                            'Salvar Alterações'
                        )}
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="min-h-screen p-6" style={{ background: "linear-gradient(to bottom, #003194, white)" }}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center mb-3">
                            <button
                                className="mr-2 text-blue-600 hover:text-blue-800"
                                onClick={() => navigate("/affiliatedashboard")}
                                aria-label="Voltar para Dashboard do Afiliado"
                            >
                                <FaArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 ">Gerenciar Tipos de Quarto</h1>
                                <p className="text-sm text-gray-500 mt-1">Gerencie os tipos de quarto do seu hotel</p>
                            </div>
                        </div>
                        <button
                            onClick={handleNewRoomType}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <FaPlus className="w-4 h-4" style={{ color: '#fff', fill: '#fff' }} />
                            Novo Quarto
                        </button>
                    </div>
                </div>

                {/* Filtros e Busca */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatusFilter("all")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Todos ({roomTypes.length})
                            </button>
                            <button
                                onClick={() => setStatusFilter("active")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "active" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Ativos ({roomTypes.filter((r) => r.isActive).length})
                            </button>
                            <button
                                onClick={() => setStatusFilter("inactive")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "inactive" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Inativos ({roomTypes.filter((r) => !r.isActive).length})
                            </button>
                        </div>

                        <div className="relative w-full sm:w-80">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar tipos de quarto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Lista de Tipos de Quarto */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredRoomTypes.map((roomType) => (
                        <div
                            key={roomType.roomTypeId}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={roomType.imageUrl || "/placeholder.svg"}
                                    alt={roomType.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => handleDropdownClick(roomType.roomTypeId, e)}
                                            className="h-8 w-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <FaEllipsisV className="h-4 w-4 text-gray-600" />
                                        </button>

                                        {activeDropdown === roomType.roomTypeId && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleEdit(roomType.roomTypeId)}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(roomType.roomTypeId)}
                                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 ${roomType.isActive ? "text-red-600" : "text-green-600"
                                                            }`}
                                                    >
                                                        {roomType.isActive ? (
                                                            <>
                                                                <FaPowerOff className="w-4 h-4 text-red-600" style={{ color: '#dc2626', fill: '#dc2626' }} />
                                                                Desativar
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaPowerOff className="w-4 h-4 text-green-800" style={{ color: '#16a34a', fill: '#16a34a' }} />
                                                                Ativar
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute top-3 left-3">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${roomType.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {roomType.isActive ? "Ativo" : "Inativo"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-blue-800 mb-2 line-clamp-1">{roomType.name}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{roomType.description}</p>
                                </div>

                                {/* Informações principais */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaDollarSign className="w-4 h-4 text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Preço/noite</p>
                                            <p className="font-semibold text-green-600 text-sm">{formatCurrency(roomType.pricePerNight)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaUsers className="w-4 h-4 text-blue-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Ocupação máx.</p>
                                            <p className="font-semibold text-blue-600 text-sm">
                                                {roomType.maxOccupancy} pessoa{roomType.maxOccupancy > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaBed className="w-4 h-4 text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Disponíveis</p>
                                            <p className="font-semibold text-green-600 text-sm">{roomType.actualAvailableRooms || (roomType.numberOfRoomsAvailable - roomType.numberOfRoomsReserved)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaBed className="w-4 h-4 text-red-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Reservados</p>
                                            <p className="font-semibold text-red-600 text-sm">{roomType.numberOfRoomsReserved}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaHashtag className="w-4 h-4 text-purple-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Números</p>
                                            <p className="font-semibold text-purple-600 text-sm">{roomType.rooms.length} cadastrados</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaBed className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Total</p>
                                            <p className="font-semibold text-gray-600 text-sm">{roomType.numberOfRoomsAvailable + roomType.numberOfRoomsReserved}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities com ícones dinâmicos */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-600 mb-2">Diferenciais:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {roomType.amenities.slice(0, 3).map((amenity, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs border flex items-center gap-1">
                                                <DynamicIcon iconName={amenity.iconName} size={12} style={{ color: 'white', fill: 'white' }} />
                                                {amenity.name}
                                            </span>
                                        ))}
                                        {roomType.amenities.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border">
                                                +{roomType.amenities.length - 3} mais
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Números dos quartos (preview) */}
                                <div>
                                    <p className="text-xs text-gray-600 mb-2">Números dos quartos:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {roomType.rooms.slice(0, 4).map((room, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                                                {room.roomNumber}
                                            </span>
                                        ))}
                                        {roomType.rooms.length > 4 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                +{roomType.rooms.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Estado vazio */}
                {filteredRoomTypes.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                        <FaBed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum tipo de quarto encontrado</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || statusFilter !== "all"
                                ? "Tente ajustar os filtros de busca."
                                : "Comece cadastrando seu primeiro tipo de quarto."}
                        </p>
                        {!searchTerm && statusFilter === "all" && (
                            <button
                                onClick={handleNewRoomType}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                            >
                                <FaPlus className="w-4 h-4" />
                                Cadastrar Primeiro Tipo de Quarto
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de Edição */}
            <EditRoomTypeModal />
        </div>
    )
}
