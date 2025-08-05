import { Button } from "../../components/Button"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import logo from "../../assets/img/logo.svg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import type { Reservation } from "../../types/reviewTypes";

export default function Review() {
  
  const [newReview, setNewReview] = useState({ rating: 0, description: "" });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  // Não há mais seleção de reserva pelo usuário
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get('reservationId');
  const userId = searchParams.get('userId');

useEffect(() => {
  const fetchReservations = async () => {
    setLoading(true);
    setError(null);

    try {
      if (reservationId) {
        // Buscar apenas a reserva específica
        const response = await axios.get(`http://localhost:5028/api/Reservation/${reservationId}`);
        setReservations(response.data ? [response.data] : []);
      } else if (userId) {
        // Buscar todas as reservas finalizadas do usuário
        const response = await axios.get(`http://localhost:5028/api/Reservation/user/${userId}`);
        const finishedReservations = response.data.filter((reservation: Reservation) => {
          const status = reservation.status?.toLowerCase();
          return status === 'finalizada' || status === 'finished' || status === 'concluida';
        });
        setReservations(finishedReservations);
      } else {
        setError("ID da reserva ou do usuário não fornecido na URL");
        setReservations([]);
      }
    } catch (error) {
      setError("Erro ao carregar reservas para avaliação.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  fetchReservations();
}, [reservationId, userId]);


// Não é mais necessário selecionar reserva


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
    

    if (!reservations.length) {
      alert("Nenhuma reserva disponível para avaliar.");
      return;
    }

    if (newReview.rating === 0 || newReview.description.trim() === "") {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (newReview.description.length < 10) {
      alert("A descrição deve ter pelo menos 10 caracteres.");
      return;
    }

    if (newReview.description.length > 500) {
      alert("A descrição deve ter no máximo 500 caracteres.");
      return;
    }

    setSubmitting(true);
    setError(null);


    try {
      // Debug: mostrar a reserva e o payload
      console.log('Reserva selecionada:', reservations[0]);
      const reviewData = {
        reservationId: reservations[0].reservationId,
        rating: newReview.rating,
        description: newReview.description.trim(),
        createdAt: new Date().toISOString()
      };
      console.log('Payload enviado para o backend:', reviewData);

      await axios.post("http://localhost:5028/api/Review", reviewData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });


      setSuccess(true);
      setNewReview({ rating: 0, description: "" });
      setReservations([]);
      
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      let errorMessage = "Erro ao enviar avaliação. Tente novamente mais tarde.";
      if (error.response?.status === 500) {
        errorMessage = "Ocorreu um erro interno ao processar sua avaliação. Por favor, verifique os dados e tente novamente em instantes. Se o problema persistir, entre em contato com o suporte.";
      } else if (error.response?.status === 400) {
        errorMessage = "Não foi possível enviar sua avaliação. Verifique se todos os campos estão preenchidos corretamente.";
      } else if (typeof error.response?.data === 'string') {
        errorMessage = error.response.data;
      }
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
          <div className="flex items-center justify-center p-6 border-gray-200">
            <img src={logo} alt="Logo Viagium" className="h-16 mr-4" />
            <h2 className="text-2xl font-bold">Escreva sua Avaliação</h2>
          </div>
          <div className="p-6">
            <form className="space-y-6" onSubmit={handleSubmitReview}>
              {/* Star Rating Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sua Avaliação</label>
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
                <label className="block text-sm font-medium text-gray-700 mt-6 mb-2">Seu Comentário</label>
                <textarea
                  placeholder="Compartilhe sua experiência com este pacote de viagem... (mínimo 10 caracteres)"
                  value={newReview.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setNewReview((prev) => ({ ...prev, description: e.target.value }));
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
                  <div className={`text-xs ${newReview.description.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                    {newReview.description.length}/500 caracteres
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
                  !reservations.length ||
                  newReview.rating === 0 ||
                  newReview.description.trim().length < 10 ||
                  newReview.description.length > 500
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