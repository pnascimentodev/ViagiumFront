import React, { useState, useEffect, useRef } from "react"
import {
  FaTimes,
  FaUpload,
  FaUsers,
  FaPlus,
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

import { validateRequired } from "../../../utils/validations"
import { maskCurrency, unmaskCurrency } from "../../../utils/masks"
import apiClient from "../../../utils/apiClient"

// Interface para os adicionais vindos da API
interface Amenity {
  amenityId: number
  name: string
  iconName: string
}

// Interface para tipo de quarto
interface RoomType {
  roomTypeId: number
  hotelId: number
  name: string
  description: string
  imageUrl: string
  pricePerNight: number
  maxOccupancy: number
  numberOfRoomsAvailable: number
  numberOfRoomsReserved: number
  createdAt: string
  isActive: boolean
  deletedAt: string | null
  rooms: Array<{
    roomId: number
    roomNumber: string
  }>
  amenities: Array<{
    amenityId: number
    name: string
    iconName: string
  }>
}

// Mapeamento dos ícones do Material Design
const iconMap: Record<string, React.ComponentType<any>> = {
  MdBathtub,
  MdBalcony,
  MdWaves,
  MdBed,
  MdWeekend,
  MdDesk,
  MdElectricKettle: MdElectricMeter,
  MdLock,
  MdMirror: MdRectangle,
  MdBlender,
  MdCheckroom,
  MdAccessible,
  MdHearing,
  MdPower,
  MdKitchen,
  MdMicrowave,
  MdFlatware,
  MdFridge: MdKitchen,
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

interface EditRoomTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  roomType: RoomType | null
}

export default function EditRoomTypeModal({ isOpen, onClose, onSave, roomType }: EditRoomTypeModalProps) {
  // Estados do formulário
  const [form, setForm] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    maxOccupancy: '',
    numberOfRoomsAvailable: '',
  })

  const [displayPrice, setDisplayPrice] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para números de quartos
  const [roomNumbers, setRoomNumbers] = useState<string[]>([])
  const [availableRooms, setAvailableRooms] = useState("")
  const [activeTab, setActiveTab] = useState("range")
  const [startNumber, setStartNumber] = useState("")
  const [endNumber, setEndNumber] = useState("")
  const [currentRoomNumber, setCurrentRoomNumber] = useState("")
  const [rangeError, setRangeError] = useState<string | null>(null)

  // Estados para amenities
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loadingAmenities, setLoadingAmenities] = useState(true)
  const [errorAmenities, setErrorAmenities] = useState<string | null>(null)
  const [currentAmenitiesPage, setCurrentAmenitiesPage] = useState(0)

  // Estados para imagem
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Constantes para paginação dos amenities
  const ITEMS_PER_PAGE = 9
  const totalAmenitiesPages = Math.ceil(amenities.length / ITEMS_PER_PAGE)
  const startIndex = currentAmenitiesPage * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPageAmenities = amenities.slice(startIndex, endIndex)

  // Carregar dados do tipo de quarto ao abrir o modal
  useEffect(() => {
    if (isOpen && roomType) {
      setForm({
        name: roomType.name,
        description: roomType.description,
        pricePerNight: roomType.pricePerNight.toString(),
        maxOccupancy: roomType.maxOccupancy.toString(),
        numberOfRoomsAvailable: roomType.numberOfRoomsAvailable.toString(),
      })
      
      setDisplayPrice(maskCurrency(roomType.pricePerNight.toString()))
      setAvailableRooms(roomType.numberOfRoomsAvailable.toString())
      setCurrentImageUrl(roomType.imageUrl)
      
      // Carregar números dos quartos
      const roomNums = roomType.rooms.map(room => room.roomNumber)
      setRoomNumbers(roomNums)
      
      // Carregar amenities selecionados
      const amenityIds = roomType.amenities.map(amenity => amenity.amenityId)
      setSelectedAmenities(amenityIds)
      
      // Limpar estados de erro
      setErrors({})
      setRangeError(null)
      setUploadError(null)
    }
  }, [isOpen, roomType])

  // Buscar amenities da API
  useEffect(() => {
    if (isOpen) {
      const fetchAmenities = async () => {
        try {
          setLoadingAmenities(true)
          const response = await fetch('http://localhost:5028/api/Amenity/TypeRoom')

          if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`)
          }

          const data: Amenity[] = await response.json()
          setAmenities(data)
          setErrorAmenities(null)

        } catch (error) {
          console.error('Erro ao buscar amenities:', error)
          setErrorAmenities('Erro ao carregar os diferenciais. Tente novamente.')
          setAmenities([])

        } finally {
          setLoadingAmenities(false)
        }
      }

      fetchAmenities()
    }
  }, [isOpen])

  // Função para ir para a próxima página de amenities
  function goToNextAmenitiesPage() {
    if (currentAmenitiesPage < totalAmenitiesPages - 1) {
      setCurrentAmenitiesPage(currentAmenitiesPage + 1)
    }
  }

  // Função para ir para a página anterior de amenities
  function goToPrevAmenitiesPage() {
    if (currentAmenitiesPage > 0) {
      setCurrentAmenitiesPage(currentAmenitiesPage - 1)
    }
  }

  // Função para alternar seleção de amenity
  function toggleAmenity(amenityId: number) {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    )
  }

  // Função para remover amenity selecionado
  function removeAmenity(amenityToRemove: number) {
    setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityToRemove))
  }

  // Função para formatar preço
  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value
    const formatted = maskCurrency(inputValue)
    setDisplayPrice(formatted)
    const cleanValue = unmaskCurrency(formatted)
    setForm(prev => ({ ...prev, pricePerNight: cleanValue }))
  }

  // Função para lidar com mudanças nos campos
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === 'numberOfRoomsAvailable') {
      setAvailableRooms(value)
    }
  }

  // Função para validação de campos
  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    const newErrors = { ...errors }

    if (name === 'name' && !validateRequired(value)) {
      newErrors.name = 'Campo obrigatório.'
    } else if (name === 'name') {
      delete newErrors.name
    }

    if (name === 'description' && !validateRequired(value)) {
      newErrors.description = 'Campo obrigatório.'
    } else if (name === 'description') {
      delete newErrors.description
    }

    if (name === 'pricePerNight') {
      if (!validateRequired(value)) {
        newErrors.pricePerNight = 'Campo obrigatório.'
      } else {
        delete newErrors.pricePerNight
      }
    }

    if (name === 'numberOfRoomsAvailable') {
      if (!validateRequired(value)) {
        newErrors.numberOfRoomsAvailable = 'Campo obrigatório.'
      } else if (isNaN(Number(value)) || Number(value) <= 0 || !Number.isInteger(Number(value))) {
        newErrors.numberOfRoomsAvailable = 'Deve ser um número inteiro maior que zero.'
      } else {
        delete newErrors.numberOfRoomsAvailable
      }
    }

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
  }

  // Funções para gerenciar números de quartos
  function generateRangeNumbers() {
    if (!startNumber || !endNumber) return

    const start = Number.parseInt(startNumber)
    const end = Number.parseInt(endNumber)

    if (start >= end) return

    const rangeCount = (end - start) + 1
    const maxRooms = availableRooms ? Number.parseInt(availableRooms) : null

    if (maxRooms && maxRooms > 0) {
      if (rangeCount > maxRooms) {
        setRangeError(`Não é possível gerar ${rangeCount} quartos. O limite é ${maxRooms} quartos disponíveis.`)
        return
      }

      if (rangeCount < maxRooms) {
        setRangeError(`Você deve cadastrar exatamente ${maxRooms} números de quartos. Faltam ${maxRooms - rangeCount} quarto(s).`)
        return
      }

      if (roomNumbers.length + rangeCount > maxRooms) {
        const quartosRestantes = maxRooms - roomNumbers.length
        setRangeError(`Você já tem ${roomNumbers.length} quartos adicionados. Só pode adicionar mais ${quartosRestantes} quarto(s).`)
        return
      }
    }

    const newNumbers: string[] = []
    for (let i = start; i <= end; i++) {
      newNumbers.push(i.toString())
    }

    setRoomNumbers(newNumbers)
    setStartNumber("")
    setEndNumber("")
    setRangeError(null)

    if (maxRooms && maxRooms > 0) {
      const newErrors = { ...errors }
      if (newNumbers.length === maxRooms) {
        delete newErrors.roomNumbers
      }
      setErrors(newErrors)
    }
  }

  function addRoomNumber() {
    if (!currentRoomNumber.trim()) return
    if (roomNumbers.includes(currentRoomNumber.trim())) return

    const maxRooms = availableRooms ? Number.parseInt(availableRooms) : null

    if (maxRooms && maxRooms > 0) {
      if (roomNumbers.length >= maxRooms) {
        return
      }
    }

    const newRoomNumbers = [...roomNumbers, currentRoomNumber.trim()]
    setRoomNumbers(newRoomNumbers)
    setCurrentRoomNumber("")

    if (maxRooms && maxRooms > 0) {
      const newErrors = { ...errors }
      if (newRoomNumbers.length === maxRooms) {
        setRangeError(null)
      } else if (newRoomNumbers.length < maxRooms) {
        setRangeError(`Você deve cadastrar exatamente ${maxRooms} números de quartos. Faltam ${maxRooms - newRoomNumbers.length} quarto(s).`)
      }
      setErrors(newErrors)
    }
  }

  function removeRoomNumber(numberToRemove: string) {
    const newRoomNumbers = roomNumbers.filter((num) => num !== numberToRemove)
    setRoomNumbers(newRoomNumbers)

    const maxRooms = availableRooms ? Number.parseInt(availableRooms) : null

    if (maxRooms && maxRooms > 0) {
      const newErrors = { ...errors }
      if (newRoomNumbers.length === maxRooms) {
        delete newErrors.roomNumbers
      } else if (newRoomNumbers.length < maxRooms) {
        newErrors.roomNumbers = `Você deve cadastrar exatamente ${maxRooms} números de quartos. Faltam ${maxRooms - newRoomNumbers.length} quarto(s).`
      } else {
        newErrors.roomNumbers = `Você deve cadastrar exatamente ${maxRooms} números de quartos. Você tem ${newRoomNumbers.length - maxRooms} quarto(s) a mais.`
      }
      setErrors(newErrors)
    }
  }

  function clearAllRooms() {
    setRoomNumbers([])
    const maxRooms = availableRooms ? Number.parseInt(availableRooms) : null

    if (maxRooms && maxRooms > 0) {
      const newErrors = { ...errors }
      newErrors.roomNumbers = `Você deve cadastrar exatamente ${maxRooms} números de quartos. Faltam ${maxRooms} quarto(s).`
      setErrors(newErrors)
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      addRoomNumber()
    }
  }

  // Funções para upload de imagem
  function handleImageButtonClick() {
    fileInputRef.current?.click()
  }

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

  async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setUploadError(null)

    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      setUploadError(validationError)
      return
    }

    setUploadingImage(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSelectedImage(file)
      setUploadError(null)
    } catch (error) {
      console.error('Erro no upload:', error)
      setUploadError('Erro ao fazer upload da imagem. Tente novamente.')
      setSelectedImage(null)
    } finally {
      setUploadingImage(false)
    }
  }

  function removeSelectedImage() {
    setSelectedImage(null)
    setUploadError(null)
    setUploadingImage(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Função para submeter o formulário
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!roomType) return

    // Validar campos obrigatórios
    const newErrors: { [key: string]: string } = {}
    if (!validateRequired(form.name)) newErrors.name = 'Campo obrigatório.'
    if (!validateRequired(form.description)) newErrors.description = 'Campo obrigatório.'
    if (!validateRequired(form.pricePerNight)) newErrors.pricePerNight = 'Campo obrigatório.'
    if (!validateRequired(form.maxOccupancy)) newErrors.maxOccupancy = 'Campo obrigatório.'
    if (!validateRequired(form.numberOfRoomsAvailable)) newErrors.numberOfRoomsAvailable = 'Campo obrigatório.'

    if (roomNumbers.length === 0) {
      newErrors.roomNumbers = 'Adicione pelo menos um número de quarto.'
    }

    // Validação da quantidade exata de quartos
    const availableRoomsNumber = Number.parseInt(form.numberOfRoomsAvailable)
    if (availableRooms && !isNaN(availableRoomsNumber) && availableRoomsNumber > 0) {
      if (roomNumbers.length !== availableRoomsNumber) {
        if (roomNumbers.length < availableRoomsNumber) {
          newErrors.roomNumbers = `Você deve cadastrar exatamente ${availableRoomsNumber} números de quartos. Faltam ${availableRoomsNumber - roomNumbers.length} quarto(s).`
        } else {
          newErrors.roomNumbers = `Você deve cadastrar exatamente ${availableRoomsNumber} números de quartos. Você tem ${roomNumbers.length - availableRoomsNumber} quarto(s) a mais.`
        }
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('Name', form.name)
      data.append('Description', form.description)
      data.append('PricePerNight', form.pricePerNight)
      data.append('MaxOccupancy', form.maxOccupancy.toString())
      data.append('NumberOfRoomsAvailable', form.numberOfRoomsAvailable.toString())
      data.append('HotelId', roomType.hotelId.toString())

      // Adicionar imagem apenas se uma nova foi selecionada
      if (selectedImage) {
        data.append('Image', selectedImage)
      }

      // Adicionar amenities selecionados
      selectedAmenities.forEach((amenityId, index) => {
        data.append(`Amenities[${index}]`, amenityId.toString())
      })

      // Adicionar números dos quartos
      roomNumbers.forEach((roomNumber, index) => {
        data.append(`RoomsNumber[${index}]`, roomNumber)
      })

      // Fazer requisição PUT para atualizar
      await apiClient.put(`/roomtype/${roomType.roomTypeId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 90000,
      })

      onSave() // Chamar callback para atualizar a lista
      onClose() // Fechar modal

    } catch (error: any) {
      console.error('Erro ao atualizar tipo de quarto:', error)

      if (error.response?.status === 401) {
        return
      }

      let errorMessage = 'Erro ao atualizar tipo de quarto.'

      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'O upload da imagem está demorando mais que o esperado. Tente com uma imagem menor.'
      } else if (error.response?.status === 504) {
        errorMessage = 'Timeout no servidor ao processar a imagem. Tente usar uma imagem menor.'
      } else if (error.response?.status === 413) {
        errorMessage = 'A imagem é muito grande. Tente usar uma imagem menor que 5MB.'
      } else {
        errorMessage = error.response?.data?.error ||
                     error.response?.data?.message ||
                     error.message ||
                     'Erro ao atualizar tipo de quarto.'
      }

      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para fechar modal
  function handleClose() {
    if (isSubmitting) return
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto backdrop-blur-sm">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Editar Tipo de Quarto</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna da Esquerda */}
            <div className="space-y-4">
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
                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-none"
                />
                {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
              </div>
            </div>

            {/* Coluna da Direita */}
            <div className="space-y-4">
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
                  {errors.pricePerNight && <div className="text-red-500 text-sm">{errors.pricePerNight}</div>}
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
                  {errors.maxOccupancy && <div className="text-red-500 text-sm">{errors.maxOccupancy}</div>}
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
                {errors.numberOfRoomsAvailable && <div className="text-red-500 text-sm">{errors.numberOfRoomsAvailable}</div>}
              </div>

              {/* Seção de Imagem */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Imagem do Quarto</label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {selectedImage ? (
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
                    <>
                      {currentImageUrl && (
                        <div className="mb-3">
                          <img 
                            src={currentImageUrl} 
                            alt="Imagem atual" 
                            className="w-20 h-20 object-cover rounded-md mx-auto"
                          />
                          <p className="text-xs text-gray-500 mt-1">Imagem atual</p>
                        </div>
                      )}
                      <FaUpload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                      <button
                        type="button"
                        onClick={handleImageButtonClick}
                        disabled={uploadingImage}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1 disabled:opacity-50"
                      >
                        {uploadingImage ? 'Enviando...' : 'Alterar Imagem'}
                      </button>
                      <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                    </>
                  )}

                  {uploadingImage && (
                    <div className="mt-2">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-blue-600">Enviando imagem...</span>
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{uploadError}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Diferenciais */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-900">Diferenciais do Quarto</label>
              <span className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-50">
                {selectedAmenities.length} selecionados
              </span>
            </div>

            <div className="bg-white">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-600">
                  {loadingAmenities ? "Carregando diferenciais..." : "Selecione os diferenciais disponíveis:"}
                </h4>

                {errorAmenities && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errorAmenities}</p>
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
                        const IconComponent = iconMap[amenity.iconName] || MdBed
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
                              type="button"
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

          {/* Seção de Números dos Quartos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-900">Números dos Quartos *</label>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-50">
                  {roomNumbers.length} de {availableRooms} quartos
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
                  type="button"
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
                              onChange={(e) => {
                                setStartNumber(e.target.value)
                                setRangeError(null)
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
                                setEndNumber(e.target.value)
                                setRangeError(null)
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
                              Boolean(availableRooms &&
                                !isNaN(Number.parseInt(availableRooms)) &&
                                Number.parseInt(availableRooms) > 0 &&
                                roomNumbers.length >= Number.parseInt(availableRooms))
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
                              Boolean(availableRooms &&
                                !isNaN(Number.parseInt(availableRooms)) &&
                                Number.parseInt(availableRooms) > 0 &&
                                roomNumbers.length >= Number.parseInt(availableRooms))
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

                  {availableRooms &&
                    !isNaN(Number.parseInt(availableRooms)) &&
                    Number.parseInt(availableRooms) > 0 &&
                    roomNumbers.length >= Number.parseInt(availableRooms) && (
                      <p className="text-sm text-amber-600 font-medium">
                        Limite atingido! Todos os {availableRooms} quartos foram adicionados.
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

            {errors.roomNumbers && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ {errors.roomNumbers}
                </p>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </div>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
