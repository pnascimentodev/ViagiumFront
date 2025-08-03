import { Button } from "../../components/Button"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import logo from "../../assets/img/logo.svg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import type { Reservation, ReviewRequest } from "../../types/reviewTypes";

export default function Review() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Buscar reservas do usuário
  useEffect(() => {
    const fetchUserReservations = async () => {
      if (!userId) {
        setError("ID do usuário não fornecido na URL");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5028/api/Reservation/user/${userId}`);
        
        // Filtrar apenas reservas com status "finalizada"
        const finishedReservations = response.data.filter((reservation: Reservation) => {
          const status = reservation.status?.toLowerCase();
          return status === 'finalizada' || 
                 status === 'finished' ||
                 status === 'concluida';
        });

        setReservations(finishedReservations);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
        setError("Erro ao carregar suas reservas. Verifique se você possui reservas finalizadas.");
        setLoading(false);
      }
    };

    fetchUserReservations();
  }, [userId]);

  // Componente de estrelas interativas
function StarRating({
  rating,
  onRate,
  size = "w-8 h-8"
}: {
  rating: number;
  onRate: (rating: number) => void;
  size?: string;
}) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          onClick={() => onRate(star)}
          className={`${size} cursor-pointer`}
          fill={star <= rating ? "#FFA62B" : "none"} // laranja preenchido, vazio caso contrário
          stroke="#d3d3d3" // contorno laranja
          viewBox="0 0 24 24"
        >
          <polygon
            points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9"
          />
        </svg>
      ))}
    </div>
  );
}

  // Envio da avaliação
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReservation) {
      alert("Por favor, selecione uma reserva para avaliar.");
      return;
    }

    if (newReview.rating === 0 || newReview.comment.trim() === "") {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (newReview.comment.length < 10) {
      alert("O comentário deve ter pelo menos 10 caracteres.");
      return;
    }

    if (newReview.comment.length > 500) {
      alert("O comentário deve ter no máximo 500 caracteres.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const reviewData: ReviewRequest = {
        reservationId: selectedReservation,
        rating: newReview.rating,
        comment: newReview.comment.trim()
      };

      await axios.post("http://localhost:5028/api/Review", reviewData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccess(true);
      setNewReview({ rating: 0, comment: "" });
      setSelectedReservation(null);
      
      // Remover a reserva avaliada da lista
      setReservations(prev => prev.filter(res => res.id !== selectedReservation));
      
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          "Erro ao enviar avaliação. Tente novamente.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Estados de carregamento e erro
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="bg-gray-50 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA62B] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando suas reservas...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="bg-gray-50 flex justify-center items-center min-h-screen">
          <div className="w-full bg-[#FFFFFF] max-w-md mx-auto rounded-lg shadow-md px-6 py-8">
            <div className="flex items-center justify-center mb-6">
              <img src={logo} alt="Logo Viagium" className="h-16 mr-4" />
              <h2 className="text-2xl font-bold text-red-600">Erro</h2>
            </div>
            <div className="text-center text-red-600 mb-6">
              {error}
            </div>
            <div className="text-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#FFA62B] hover:bg-[#FF9500] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <Navbar />
        <div className="bg-gray-50 flex justify-center items-center min-h-screen">
          <div className="w-full bg-[#FFFFFF] max-w-md mx-auto rounded-lg shadow-md px-6 py-8">
            <div className="flex items-center justify-center mb-6">
              <img src={logo} alt="Logo Viagium" className="h-16 mr-4" />
              <h2 className="text-2xl font-bold text-green-600">Sucesso!</h2>
            </div>
            <div className="text-center text-green-600 mb-6 text-lg">
              Sua avaliação foi enviada com sucesso!
            </div>
            <div className="text-center space-y-3">
              {reservations.length > 0 && (
                <Button
                  onClick={() => setSuccess(false)}
                  className="w-full bg-[#FFA62B] hover:bg-[#FF9500] text-white font-semibold py-2 px-6 rounded-lg transition-colors mb-2"
                >
                  Avaliar Outra Reserva
                </Button>
              )}
              <Button
                onClick={() => window.location.href = "/"}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="bg-gray-50 flex justify-center items-center min-h-screen">
          <div className="w-full bg-[#FFFFFF] max-w-md mx-auto rounded-lg shadow-md px-6 py-8">
            <div className="flex items-center justify-center mb-6">
              <img src={logo} alt="Logo Viagium" className="h-16 mr-4" />
              <h2 className="text-2xl font-bold text-gray-700">Nenhuma Reserva</h2>
            </div>
            <div className="text-center text-gray-600 mb-6">
              Você não possui reservas finalizadas para avaliar no momento.
            </div>
            <div className="text-center">
              <Button
                onClick={() => window.location.href = "/packagesearch"}
                className="bg-[#FFA62B] hover:bg-[#FF9500] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Explorar Pacotes
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 flex justify-center items-center min-h-screen py-8">
        <div className="w-full bg-[#FFFFFF] max-w-lg mx-4 rounded-lg shadow-md">
          <div className="flex items-center justify-center p-6 border-b border-gray-200">
            <img src={logo} alt="Logo Viagium" className="h-16 mr-4" />
            <h2 className="text-2xl font-bold">Escreva sua Avaliação</h2>
          </div>
          
          <div className="p-6">
            <form className="space-y-6" onSubmit={handleSubmitReview}>
              {/* Seleção de Reserva */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione a Reserva para Avaliar
                </label>
                <select
                  value={selectedReservation || ""}
                  onChange={(e) => setSelectedReservation(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA62B] focus:border-transparent bg-white"
                  required
                >
                  <option value="">Selecione uma reserva...</option>
                  {reservations.map((reservation) => (
                    <option key={reservation.id} value={reservation.id}>
                      {reservation.travelPackage?.packageName || `Reserva #${reservation.id}`} - 
                      {" "}{reservation.travelPackage?.destinationAddress?.city || "Destino não informado"}
                      {" "}({new Date(reservation.startDate).toLocaleDateString('pt-BR')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Informações da reserva selecionada */}
              {selectedReservation && (
                <div className="bg-gray-50 p-4 rounded-md">
                  {(() => {
                    const selected = reservations.find(r => r.id === selectedReservation);
                    return selected ? (
                      <div className="text-sm text-gray-600">
                        <p><strong>Pacote:</strong> {selected.travelPackage?.packageName || 'Nome não disponível'}</p>
                        <p><strong>Destino:</strong> {selected.travelPackage?.destinationAddress?.city}, {selected.travelPackage?.destinationAddress?.country}</p>
                        <p><strong>Data da viagem:</strong> {new Date(selected.startDate).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Valor:</strong> R$ {selected.totalPrice?.toFixed(2) || '0,00'}</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Star Rating Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sua Avaliação</label>
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={newReview.rating}
                    onRate={(rating) => setNewReview((prev) => ({ ...prev, rating }))}
                  />
                  <span className="text-sm text-gray-600">
                    {newReview.rating > 0 ? `${newReview.rating}/5 estrelas` : "Clique para avaliar"}
                  </span>
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seu Comentário</label>
                <textarea
                  placeholder="Compartilhe sua experiência com este pacote de viagem... (mínimo 10 caracteres)"
                  value={newReview.comment}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setNewReview((prev) => ({ ...prev, comment: e.target.value }));
                    }
                  }}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA62B] focus:border-transparent resize-none"
                  required
                  minLength={10}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">
                    Mínimo: 10 caracteres
                  </div>
                  <div className={`text-xs ${newReview.comment.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                    {newReview.comment.length}/500 caracteres
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  submitting || 
                  !selectedReservation || 
                  newReview.rating === 0 || 
                  newReview.comment.trim().length < 10 ||
                  newReview.comment.length > 500
                }
                className="w-full bg-[#FFA62B] hover:bg-[#FF9500] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </span>
                ) : (
                  "Enviar Avaliação"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}