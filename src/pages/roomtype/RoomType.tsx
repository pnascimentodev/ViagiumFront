// import type React from "react"
import {
  FaPlus,
  FaTimes,
  FaUpload,
  FaUsers,
  FaHashtag,
} from "react-icons/fa"

import {
  MdBathtub,
  MdBalcony,
  MdWaves,
  MdBed,
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

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { validateRequired } from "../../utils/validations"

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
  MdBed,
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

function RoomType() {
  const [roomNumbers, setRoomNumbers] = useState<string[]>([])
  const [availableRooms, setAvailableRooms] = useState("") 
  const [activeTab, setActiveTab] = useState("range") // Estado para controlar a aba ativa (range ou manual)

  // Estados para geração automática
  const [startNumber, setStartNumber] = useState("")
  const [endNumber, setEndNumber] = useState("")

  // Estados para adição manual
  const [currentRoomNumber, setCurrentRoomNumber] = useState("")

  // Estados para diferenciais do quarto
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]) // Lista de diferenciais selecionados
  const [amenities, setAmenities] = useState<Amenity[]>([]) // Lista de diferenciais disponíveis
  const [loadingAmenities, setLoadingAmenities] = useState(true) // Estado para indicar se os diferenciais estão sendo carregados
  const [errorAmenities, setErrorAmenities] = useState<string | null>(null) // Estado para erros ao carregar diferenciais
  const [currentAmenitiesPage, setCurrentAmenitiesPage] = useState(0) // Página atual dos diferenciais (é um tipo de array, o 0 é a primeira página, a que vai ser mostrada inicialmente)

  // Estados para upload de imagem
  const [selectedImage, setSelectedImage] = useState<File | null>(null) // Estado para o arquivo selecionado
  const [uploadingImage, setUploadingImage] = useState(false) // Estado para indicar se está enviando a imagem
  const [uploadError, setUploadError] = useState<string | null>(null) // Estado para erros de upload
  
  // Referência para o input de arquivo (oculto)
  const fileInputRef = useRef<HTMLInputElement>(null) 

  // Constantes para paginação dos adicionais
  const ITEMS_PER_PAGE = 9 // 3 colunas x 4 itens
  const totalAmenitiesPages = Math.ceil(amenities.length / ITEMS_PER_PAGE) // Total de páginas de diferenciais
  const startIndex = currentAmenitiesPage * ITEMS_PER_PAGE // Índice inicial da página atual
  const endIndex = startIndex + ITEMS_PER_PAGE // Índice final da página atual
  const currentPageAmenities = amenities.slice(startIndex, endIndex) // Diferenciais da página atual

  // Função para ir para a próxima página de diferenciais
  function goToNextAmenitiesPage() {
    if (currentAmenitiesPage < totalAmenitiesPages - 1) { // Verifica se não é a última página
      setCurrentAmenitiesPage(currentAmenitiesPage + 1) // Avança para a próxima página
    }
  }

  // Função para ir para a página anterior de diferenciais
  function goToPrevAmenitiesPage() {
    if (currentAmenitiesPage > 0) { // Verifica se não é a primeira página
      setCurrentAmenitiesPage(currentAmenitiesPage - 1) // Volta para a página anterior
    }
  }

  // Buscar amenities da API
  useEffect(() => {
    const fetchAmenities = async () => { // Função para buscar os diferenciais da API
      try {
        setLoadingAmenities(true) // Indica que os diferenciais estão sendo carregados
        const response = await fetch('https://localhost:7259/api/Amenity/TypeRoom') // Requisição para a API
        
        if (!response.ok) { // Verifica se a resposta foi bem sucedida
          throw new Error(`Erro na API: ${response.status}`) // Lança erro se a resposta não for
        }
        
        // Converte a resposta em JSON e atualiza o estado
        const data: Amenity[] = await response.json() // Converte a resposta em JSON
        setAmenities(data) // Atualiza o estado com os diferenciais recebidos
        setErrorAmenities(null) // Limpa qualquer erro anterior

      } catch (error) {
        console.error('Erro ao buscar amenities:', error) // Log do erro no console
        setErrorAmenities('Erro ao carregar os diferenciais. Tente novamente.') // Define mensagem de erro
        setAmenities([]) // Fallback para array vazio

      } finally {
        setLoadingAmenities(false) // Indica que o carregamento foi concluído
      }
    }

    fetchAmenities() // Chama a função para buscar os diferenciais
  }, [])

  // Função para Geração automática de números de quartos por intervalo (Intervalor) 
  function generateRangeNumbers() {
    if (!startNumber || !endNumber) return

    const start = Number.parseInt(startNumber)
    const end = Number.parseInt(endNumber)

    if (start >= end) return

    const newNumbers: string[] = []
    for (let i = start; i <= end; i++) {
      newNumbers.push(i.toString())
    }

    setRoomNumbers(newNumbers)
    setStartNumber("")
    setEndNumber("")
  }

  // Função para adicionar um número de quarto manualmente a lista de números de quartos
  function addRoomNumber() {
    if (currentRoomNumber.trim() && !roomNumbers.includes(currentRoomNumber.trim())) {
      setRoomNumbers([...roomNumbers, currentRoomNumber.trim()])
      setCurrentRoomNumber("")
    }
  }

  // Função para remover um número de quarto específico
  function removeRoomNumber(numberToRemove: string) {
    setRoomNumbers(roomNumbers.filter((num) => num !== numberToRemove))
  }

  // Função para limpar todos os números de quartos (na aba automático)
  function clearAllRooms() {
    setRoomNumbers([])
  }

  // Função para lidar com o pressionamento da tecla Enter no campo de número de quarto (na aba manual)
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      addRoomNumber()
    }
  }

  // Função para alternar a seleção de um diferencial (basicamente um interruptor (toggle) para selecionar e desselecionar diferenciais do quarto.)
  function toggleAmenity(amenityId: number) {
    // Se o amenityId JÁ ESTÁ na lista de selecionados:
    setSelectedAmenities((prev) =>
      prev.includes(amenityId) 
    ? prev.filter((id) => id !== amenityId) // REMOVE da lista 
    : [...prev, amenityId], // ADICIONA na lista
    )
  }

  // Função para remover um diferencial selecionado
  function removeAmenity(amenityToRemove: number) {
    setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityToRemove))
  }

  // Função para abrir o seletor de arquivos
  function handleImageButtonClick() {
    fileInputRef.current?.click()
  }

  // Função para validar o arquivo selecionado
  function validateImageFile(file: File): string | null {
    const maxSize = 5 * 1024 * 1024 // 5MB em bytes
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']

    if (!allowedTypes.includes(file.type)) {
      return 'Formato não suportado. Use apenas PNG ou JPG.'
    }

    if (file.size > maxSize) {
      return 'Arquivo muito grande. Máximo 5MB.'
    }

    return null
  }

  // Função para processar arquivo selecionado
  function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setUploadError(null)

    if (!file) return

    // Validar arquivo
    const validationError = validateImageFile(file)
    if (validationError) {
      setUploadError(validationError)
      return
    }

    // Armazenar arquivo selecionado
    setSelectedImage(file)
  }

  // Função para remover imagem selecionada
  function removeSelectedImage() {
    setSelectedImage(null)
    setUploadError(null)
    
    // Limpar input file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const [form, setForm] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    maxOccupancy: '',
    numberOfRoomsAvailable: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Função para formatar o preço enquanto digita
function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
  let value = e.target.value
  
  // Remove caracteres não numéricos exceto . e ,
  value = value.replace(/[^\d.,]/g, '')
  
  // Substitui vírgula por ponto para padronização interna
  value = value.replace(',', '.')
  
  // Limita a 2 casas decimais
  const parts = value.split('.')
  if (parts[1] && parts[1].length > 2) {
    value = `${parts[0]}.${parts[1].slice(0, 2)}`
  }
  
  setForm(prev => ({ ...prev, pricePerNight: value }))
}

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  const { name, value } = e.target
  setForm(prev => ({ ...prev, [name]: value }))
  
  if (name === 'numberOfRoomsAvailable') {
    setAvailableRooms(value)
  }
}

function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  const { name, value } = e.target
  
  // Validar apenas o campo que perdeu o foco
  const newErrors = { ...errors }
  
  // Validação individual por campo
  if (name === 'name' && !validateRequired(value)) {
    newErrors.name = 'Campo obrigatório.'
  } else if (name === 'name') {
    delete newErrors.name // Remove erro se válido
  }
  
  if (name === 'description' && !validateRequired(value)) {
    newErrors.description = 'Campo obrigatório.'
  } else if (name === 'description') {
    delete newErrors.description
  }
  
  if (name === 'pricePerNight') {
    if (!validateRequired(value)) {
      newErrors.pricePerNight = 'Campo obrigatório.'
    } else if (isNaN(Number(value)) || Number(value) <= 0) {
      newErrors.pricePerNight = 'Preço deve ser um número válido maior que zero.'
    } else {
      delete newErrors.pricePerNight
    }
  }

  // Validação para numberOfRoomsAvailable
  if (name === 'numberOfRoomsAvailable') {
    if (!validateRequired(value)) {
      newErrors.numberOfRoomsAvailable = 'Campo obrigatório.'
    } else if (isNaN(Number(value)) || Number(value) <= 0 || !Number.isInteger(Number(value))) {
      newErrors.numberOfRoomsAvailable = 'Deve ser um número inteiro maior que zero.'
    } else {
      delete newErrors.numberOfRoomsAvailable
    }
  }

  // Validação para Preço por noite
  if (name === 'pricePerNight') {
  if (!validateRequired(value)) {
    newErrors.pricePerNight = 'Campo obrigatório.'
  } else {
    // Substitui vírgula por ponto para validação
    const numericValue = value.replace(',', '.')
    
    if (isNaN(Number(numericValue)) || Number(numericValue) <= 0) {
      newErrors.pricePerNight = 'Preço deve ser um número válido maior que zero.'
    } else if (Number(numericValue) > 9999.99) {
      newErrors.pricePerNight = 'Preço muito alto. Máximo R$ 9.999,99.'
    } else {
      delete newErrors.pricePerNight
    }
  }
}

 // Validação para maxOccupancy
  if (name === 'maxOccupancy') {
    if (!validateRequired(value)) {
      newErrors.maxOccupancy = 'Campo obrigatório.'
    } else if (isNaN(Number(value)) || Number(value) <= 0 || !Number.isInteger(Number(value))) {
      newErrors.maxOccupancy = 'Deve ser um número inteiro maior que zero.'
    } else {
      delete newErrors.maxOccupancy
    }
  }
  
  
  setErrors(newErrors)
};

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validar campos obrigatórios
    const newErrors: { [key: string]: string } = {};
    if(!validateRequired(form.name)) newErrors.name = 'Campo obrigatório.';
    if(!validateRequired(form.description)) newErrors.description = 'Campo obrigatório.';
    if(!validateRequired(form.pricePerNight)) newErrors.pricePerNight = 'Campo obrigatório.';
    if(!validateRequired(form.maxOccupancy)) newErrors.maxOccupancy = 'Campo obrigatório.';
    if(!validateRequired(form.numberOfRoomsAvailable)) newErrors.numberOfRoomsAvailable = 'Campo obrigatório.';

    if (!selectedImage) {
      newErrors.imageUrl = 'Selecione uma imagem para o tipo de quarto.';
      setErrors(newErrors);
      return;
    }

    // ADICIONAR validação para números dos quartos
    if (roomNumbers.length === 0) {
      newErrors.roomNumbers = 'Adicione pelo menos um número de quarto.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.log("⚠️ Erros de validação encontrados:", newErrors);
      return;
    }

    const priceValue = form.pricePerNight.replace(',', '.') // Substitui vírgula por ponto para conversão correta


    const data = new FormData();
    data.append('Name', form.name);
    data.append('Description', form.description);
    data.append('PricePerNight', priceValue); // como string
    data.append('MaxOccupancy', form.maxOccupancy.toString());
    data.append('NumberOfRoomsAvailable', form.numberOfRoomsAvailable.toString());
    data.append('HotelId', "2"); // id mockado para teste
    data.append('Image', selectedImage); 

    // ADICIONAR OS AMENITIES SELECIONADOS COMO LISTA
    selectedAmenities.forEach((amenityId, index) => {
      data.append(`Amenities[${index}]`, amenityId.toString());
    });

    //  ADICIONAR OS NÚMEROS DOS QUARTOS
    roomNumbers.forEach((roomNumber, index) => {
      data.append(`RoomsNumber[${index}]`, roomNumber);
    });

    axios.post('https://localhost:7259/api/roomtype', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(() => alert('Cadastro realizado com sucesso!'))
    .catch(error => {
      const msg = error.response?.data?.error || error.message || 'Erro ao cadastrar tipo de quarto.';
      alert(msg);
    });
      }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
  style={{
    background: 'linear-gradient(to bottom, #003194, black)',
  }}> 
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar Tipo de Quarto</h1>
          <p className="text-gray-600 mt-2">Registre um novo tipo de quarto no sistema de pacotes de viagem</p>
        </div> 
        
        <form className="flex flex-col gap-5 p-6 space-y-6" onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor="roomType" className="text-sm font-medium text-gray-700">
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
                {errors.name && <div style={{ color: 'red', fontWeight: 500 }}>{errors.name}</div>}
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
                {errors.description && <div style={{ color: 'red', fontWeight: 500 }}>{errors.description}</div>}
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
                    value={form.pricePerNight}
                    onChange={handlePriceChange}
                    onBlur={handleBlur}

                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.pricePerNight && <div style={{ color: 'red', fontWeight: 500 }}>{errors.pricePerNight}</div>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="occupancy" className="text-sm font-medium text-gray-700">
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
                  {errors.maxOccupancy && <div style={{ color: 'red', fontWeight: 500 }}>{errors.maxOccupancy}</div>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="availableRooms" className="text-sm font-medium text-gray-700">
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
                {errors.numberOfRoomsAvailable && <div style={{ color: 'red', fontWeight: 500 }}>{errors.numberOfRoomsAvailable}</div>}
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

          <div className="space-y-4"> 
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-900 ">Diferenciais do Quarto</label>
              <span className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-50">
                {selectedAmenities.length} selecionados
              </span>
            </div>

            <div className="bg-white">
              <div className="space-y-4 flex flex-col gap-4">
                <h4 className="font-medium text-sm text-gray-600">
                  {loadingAmenities ? "Carregando diferenciais..." : "Selecione os diferenciais disponíveis:"}
                </h4>

                {errorAmenities && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errorAmenities}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="text-sm text-red-700 underline mt-1"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}

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
                        const IconComponent = iconMap[amenity.iconName] || MdBed // Fallback icon
                        const isSelected = selectedAmenities.includes(amenity.amenityId)

                        return (
                          <div
                            key={amenity.amenityId}
                            className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 gap-3 ${
                              isSelected
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
                        )
                      })}
                    </div>
                    
                    {totalAmenitiesPages > 1 && (
                      <div className="flex items-center justify-between pt-4">
                        <button
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
                        const amenity = amenities.find((a) => a.amenityId === amenityId)
                        const IconComponent = amenity ? (iconMap[amenity.iconName] || MdBed) : MdBed

                        return (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200"
                          >
                            <IconComponent className="w-3 h-3" />
                            {amenity?.name || 'Diferencial não encontrado'}
                            <button
                              className="ml-1 w-4 h-4 flex items-center justify-center hover:bg-blue-300 hover:text-blue-900 rounded"
                              onClick={() => removeAmenity(amenityId)}
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* <hr className="border-gray-800" /> */}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-900">Números dos Quartos *</label>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-50">
                  {roomNumbers.length} de {availableRooms} quartos
                </span>
                {roomNumbers.length > 0 && (
                  <button
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
                  onClick={() => setActiveTab("range")}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "range"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FaHashtag className="w-4 h-4" />
                  Vários Quartos de Uma Vez
                </button>
                
                <button
                  onClick={() => setActiveTab("manual")}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "manual"
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
                              onChange={(e) => setStartNumber(e.target.value)}
                              placeholder="101"
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700">Número Final</label>
                            <input
                              value={endNumber}
                              onChange={(e) => setEndNumber(e.target.value)}
                              placeholder="115"
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <button
                            onClick={generateRangeNumbers}
                            disabled={!startNumber || !endNumber}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Gerar Intervalo
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">Ex: De 101 até 115 gerará: 101, 102, 103... 115</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* acredito que vou apagar isso */}
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
                            onClick={addRoomNumber}
                            disabled={!currentRoomNumber.trim() || roomNumbers.includes(currentRoomNumber.trim())}
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
                  <h4 className="font-medium text-sm text-gray-600">Quartos Adicionados:</h4>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {roomNumbers.map((number, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-900 text-white rounded-md text-sm font-medium"
                      >
                        Quarto {number}
                        <button
                          className="ml-1 w-4 h-4 flex items-center justify-center hover:bg-red-600 hover:text-white rounded"
                          onClick={() => removeRoomNumber(number)}
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {roomNumbers.length !== Number.parseInt(availableRooms) && (
                    <p className="text-sm text-gray-500">
                      {roomNumbers.length < Number.parseInt(availableRooms)
                        ? `Faltam ${Number.parseInt(availableRooms) - roomNumbers.length} quarto(s)`
                        : `${roomNumbers.length - Number.parseInt(availableRooms)} quarto(s) a mais que o esperado`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={roomNumbers.length === 0 || uploadingImage}
          >
            Cadastrar Tipo de Quarto
          </button>
        </form>

      </div>
    </div>
  )
}

export default RoomType;
