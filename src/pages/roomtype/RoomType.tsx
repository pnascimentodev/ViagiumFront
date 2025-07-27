// import type React from "react"
import {
  FaPlus,
  FaTimes,
  FaUpload,
  FaUsers,
  FaMagic,
  FaHashtag,
  FaBuilding,
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

// Interface para os adicionais vindos da API
interface Amenity {
  amenityId: number
  slug: string
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

// Função para converter slug em label legível
function slugToLabel(slug: string): string {
  const labelMap: Record<string, string> = {
    "banheira": "Banheira",
    "varanda": "Varanda",
    "vista-mar": "Vista para o Mar",
    "cama-king-size": "Cama King Size",
    "cama-queen-size": "Cama Queen Size",
    "sofa-cama": "Sofá Cama", 
    "mesa-trabalho": "Mesa de Trabalho",
    "chaleira-eletrica": "Chaleira Elétrica",
    "cofre": "Cofre",
    "espelho-corpo-inteiro": "Espelho de Corpo Inteiro",
    "secador-cabelo": "Secador de Cabelo",
    "roupao-chinelos": "Roupão e Chinelos",
    "acessivel-pcd": "Acessível PCD",
    "isolamento-acustico": "Isolamento Acústico",
    "tomada-perto-cama": "Tomada Perto da Cama",
    "cozinha-acoplada": "Cozinha Acoplada",
    "micro-ondas": "Micro-ondas",
    "utensilios-cozinha": "Utensílios de Cozinha",
    "geladeira": "Geladeira",
    "area-estar": "Área de Estar",
    "smart-tv": "Smart TV",
    "cortinas-blackout": "Cortinas Blackout",
    "controle-temperatura": "Controle de Temperatura",
    "assistente-virtual": "Assistente Virtual",
    "iluminacao-ambiente": "Iluminação Ambiente",
    "chuveiro-aquecido": "Chuveiro Aquecido",
    "maquina-cafe": "Máquina de Café",
    "sem-carpete": "Sem Carpete",
    "entrada-cartao": "Entrada por Cartão",
    "espaco-refeicoes": "Espaço para Refeições",
    "piscina-privativa": "Piscina Privativa",
    "berco-disponivel": "Berço Disponível",
  }
  
  return labelMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function RoomType() {
  const [roomNumbers, setRoomNumbers] = useState<string[]>([])
  const [availableRooms, setAvailableRooms] = useState("10") // Valor inicial para o campo de número de quartos disponíveis
  const [activeTab, setActiveTab] = useState("smart")

  // Estados para geração automática
  const [startNumber, setStartNumber] = useState("")
  const [endNumber, setEndNumber] = useState("")
  const [floorPrefix, setFloorPrefix] = useState("")
  const [roomsPerFloor, setRoomsPerFloor] = useState("")
  const [startingRoom, setStartingRoom] = useState("")

  // Estados para adição manual
  const [currentRoomNumber, setCurrentRoomNumber] = useState("")

  // Estados para diferenciais do quarto
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]) // Lista de diferenciais selecionados
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
  const ITEMS_PER_PAGE = 12 // 3 colunas x 4 itens
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
        const response = await fetch('https://localhost:7259/api/Amenity') // Requisição para a API
        
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

  // Função para Geração por andar de números de quartos (Por andar)
  function generateFloorNumbers() {
    if (!floorPrefix || !roomsPerFloor || !startingRoom) return

    const floors = floorPrefix.split(",").map((f) => f.trim())
    const roomsCount = Number.parseInt(roomsPerFloor)
    const startRoom = Number.parseInt(startingRoom)

    const newNumbers: string[] = []

    floors.forEach((floor) => {
      for (let i = 0; i < roomsCount; i++) {
        const roomNum = (startRoom + i).toString().padStart(2, "0")
        newNumbers.push(`${floor}${roomNum}`)
      }
    })

    setRoomNumbers(newNumbers)
    setFloorPrefix("")
    setRoomsPerFloor("")
    setStartingRoom("")
  }

  // Função para Geração automática inteligente de números de quartos (Automatico)
  function generateSmartNumbers() {
    const count = Number.parseInt(availableRooms)
    if (!count) return

    const newNumbers: string[] = []

    // Gera números sequenciais começando em 101
    for (let i = 1; i <= count; i++) {
      const roomNumber = (100 + i).toString()
      newNumbers.push(roomNumber)
    }

    setRoomNumbers(newNumbers)
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
  function toggleAmenity(amenitySlug: string) {
    // Se o amenitySlug JÁ ESTÁ na lista de selecionados:
    setSelectedAmenities((prev) =>
      prev.includes(amenitySlug) 
    ? prev.filter((slug) => slug !== amenitySlug) // REMOVE da lista 
    : [...prev, amenitySlug], // ADICIONA na lista
    )
  }

  // Função para remover um diferencial selecionado
  function removeAmenity(amenityToRemove: string) {
    setSelectedAmenities(selectedAmenities.filter((amenity) => amenity !== amenityToRemove))
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

  // Função para fazer upload da imagem para a API (VERIFICAR)
  async function uploadImageToAPI(file: File): Promise<string | null> {
    try {
      setUploadingImage(true)
      setUploadError(null)

      // Criar FormData para envio multipart/form-data
      const formData = new FormData()
      formData.append('image', file) // 'image' é o nome do campo esperado pela API

      // Fazer requisição para API
      const response = await axios.post('https://localhost:7259/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 segundos timeout
      })

      // Retornar URL da imagem ou ID conforme sua API retorna
      return response.data.imageUrl || response.data.url || response.data.id

    } catch (error: any) {
      console.error('Erro no upload:', error)
      
      if (error.code === 'ECONNABORTED') {
        setUploadError('Timeout no upload. Tente novamente.')
      } else if (error.response?.status === 413) {
        setUploadError('Arquivo muito grande para o servidor.')
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        setUploadError('Erro na requisição. Verifique o arquivo.')
      } else {
        setUploadError('Erro no servidor. Tente novamente.')
      }
      
      return null
    } finally {
      setUploadingImage(false)
    }
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
        <div className="flex flex-col gap-5 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor="roomType" className="text-sm font-medium text-gray-700">
                  Nome do Tipo de Quarto *
                </label>
                <input
                  id="roomType"
                  placeholder="Ex: Quarto Standard Duplo"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Descrição *
                </label>
                <textarea
                  id="description"
                  placeholder="Descreva as características e comodidades do quarto..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[230px] resize-none"
                />
              </div>
            </div>

            <div className="space-y-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Preço por Noite (R$) *
                  </label>
                  <input
                    id="price"
                    placeholder="R$ 0,00"
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="occupancy" className="text-sm font-medium text-gray-700">
                    <FaUsers className="w-4 h-4 inline mr-1" />
                    Ocupação Máxima *
                  </label>
                  <select className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione</option>
                    <option value="1">1 pessoa</option>
                    <option value="2">2 pessoas</option>
                    <option value="3">3 pessoas</option>
                    <option value="4">4 pessoas</option>
                    <option value="5">5 pessoas</option>
                    <option value="6">6 pessoas</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="availableRooms" className="text-sm font-medium text-gray-700">
                  Número de Quartos Disponíveis *
                </label>
                <input
                  id="availableRooms"
                  value={availableRooms}
                  onChange={(e) => setAvailableRooms(e.target.value)}
                  placeholder="15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
                    <div className="grid grid-cols-3 gap-3">
                      {currentPageAmenities.map((amenity) => {
                        const IconComponent = iconMap[amenity.iconName] || MdBed // Fallback icon
                        const isSelected = selectedAmenities.includes(amenity.slug)
                        const label = slugToLabel(amenity.slug)

                        return (
                          <div
                            key={amenity.amenityId}
                            className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 gap-3 ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => toggleAmenity(amenity.slug)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleAmenity(amenity.slug)}
                              className="pointer-events-none w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <IconComponent className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                            <span className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                              {label}
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
                      {selectedAmenities.map((amenitySlug, index) => {
                        const amenity = amenities.find((a) => a.slug === amenitySlug)
                        const label = amenity ? slugToLabel(amenity.slug) : amenitySlug
                        const IconComponent = amenity ? (iconMap[amenity.iconName] || MdBed) : MdBed

                        return (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200"
                          >
                            <IconComponent className="w-3 h-3" />
                            {label}
                            <button
                              className="ml-1 w-4 h-4 flex items-center justify-center hover:bg-blue-300 hover:text-blue-900 rounded"
                              onClick={() => removeAmenity(amenitySlug)}
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
                  onClick={() => setActiveTab("smart")}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "smart"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FaMagic className="w-4 h-4" />
                  Automático
                </button>
                <button
                  onClick={() => setActiveTab("range")}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "range"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FaHashtag className="w-4 h-4" />
                  Intervalo
                </button>
                <button
                  onClick={() => setActiveTab("floor")}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "floor"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FaBuilding className="w-4 h-4" />
                  Por Andar
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
                  Manual
                </button>
              </div>

              <div className="mt-4">
                {activeTab === "smart" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-2 text-blue-700">
                          <FaMagic className="w-5 h-5" />
                          <h3 className="font-semibold">Geração Automática Inteligente</h3>
                        </div>
                        <p className="text-sm text-blue-600">
                          Gera automaticamente {availableRooms} números sequenciais começando em 101
                        </p>
                        <button
                          onClick={generateSmartNumbers}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center mx-auto"
                        >
                          <FaMagic className="w-4 h-4 mr-2" />
                          Gerar {availableRooms} Quartos Automaticamente
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "range" && (
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <FaHashtag className="w-4 h-4" />
                          Gerar por Intervalo Numérico
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

                {activeTab === "floor" && (
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <FaBuilding className="w-4 h-4" />
                          Gerar por Andar
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700">Andares (separados por vírgula)</label>
                            <input
                              value={floorPrefix}
                              onChange={(e) => setFloorPrefix(e.target.value)}
                              placeholder="1, 2, 3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700">Quartos por Andar</label>
                            <input
                              value={roomsPerFloor}
                              onChange={(e) => setRoomsPerFloor(e.target.value)}
                              placeholder="5"
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700">Número Inicial</label>
                            <input
                              value={startingRoom}
                              onChange={(e) => setStartingRoom(e.target.value)}
                              placeholder="01"
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={generateFloorNumbers}
                          disabled={!floorPrefix || !roomsPerFloor || !startingRoom}
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Gerar Quartos por Andar
                        </button>
                        <p className="text-xs text-gray-500">
                          Ex: Andares 1,2,3 com 5 quartos cada, começando em 01 = 101, 102, 103, 104, 105, 201, 202...
                        </p>
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
                          Adicionar Manualmente
                        </h3>
                        <div className="flex gap-2">
                          <input
                            value={currentRoomNumber}
                            onChange={(e) => setCurrentRoomNumber(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ex: 101, A01, Suite-1..."
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={roomNumbers.length === 0}
          >
            Cadastrar Tipo de Quarto
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomType
