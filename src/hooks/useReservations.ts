import { useState, useEffect } from 'react'

export interface Reservation {
  id: string
  title: string
  description: string
  destination: string
  duration: string
  image: string
  startDate: string
  endDate: string
  status: 'confirmed' | 'finished' | 'cancelled'
  price: string
  createdAt: string
  // Campos alternativos que podem vir da API
  packageTitle?: string
  packageDescription?: string
  packageDestination?: string
  packageDuration?: string
  packageImage?: string
  packagePrice?: string
  reservationStatus?: string
  checkInDate?: string
  checkOutDate?: string
}

export interface UseReservationsReturn {
  reservations: Reservation[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useReservations = (userId: string): UseReservationsReturn => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para normalizar os dados da API
  const normalizeReservation = (apiData: any): Reservation => {
    // Dados do pacote de viagem
    const travelPackage = apiData.travelPackage || {}
    
    // Dados do hotel
    const hotel = apiData.hotel || {}
    const hotelAddress = hotel.address || {}
    
    // Dados do tipo de quarto
    const roomType = apiData.roomType || {}
    
    // Extrair dados dos viajantes
    const travelers = apiData.travelers || []
    const travelerNames = travelers.map((t: any) => 
      `${t.firstName || ''} ${t.lastName || ''}`.trim()
    ).filter((name: string) => name).join(', ')

    // Dados do usuário
    const user = apiData.user || {}
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim()

    // Construir destino baseado no endereço do hotel
    const destination = hotelAddress.city && hotelAddress.state 
      ? `${hotelAddress.city}, ${hotelAddress.state}${hotelAddress.country ? `, ${hotelAddress.country}` : ''}`
      : hotel.name || 'Destino não informado'

    // Construir descrição combinando pacote e hotel
    const description = travelPackage.description || hotel.description || `Reserva para: ${travelerNames || userName}`

    return {
      id: apiData.reservationId?.toString() || '',
      title: travelPackage.title || hotel.name || `Reserva de ${userName}`,
      description: description,
      destination: destination,
      duration: travelPackage.duration ? `${travelPackage.duration} dias` : 'Duração não informada',
      image: hotel.imageUrl || roomType.imageUrl || 'https://via.placeholder.com/300x200?text=Pacote+de+Viagem',
      startDate: apiData.checkInDate || '', // Você pode adicionar essas datas na sua API se necessário
      endDate: apiData.checkOutDate || '',
      status: (apiData.status?.toLowerCase() || 'confirmed') as 'confirmed' | 'finished' | 'cancelled',
      price: travelPackage.price ? `R$ ${travelPackage.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Preço não informado',
      createdAt: user.createdAt || new Date().toISOString(),
    }
  }

  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`https://viagium.azurewebsites.net/api/Reservation/user/${userId}`)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar reservas: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Normalizar os dados antes de definir no estado
      const normalizedData = Array.isArray(data) 
        ? data.map(normalizeReservation)
        : [normalizeReservation(data)]
      
      setReservations(normalizedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar reservas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchReservations()
    }
  }, [userId])

  const refetch = () => {
    fetchReservations()
  }

  return {
    reservations,
    loading,
    error,
    refetch
  }
}
