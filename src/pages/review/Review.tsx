import { Button } from "../../components/Button"
import { useState } from "react"
import logo from "../../assets/img/logo.svg";

export default function Review() {
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

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
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating > 0 && newReview.comment.trim()) {
      // Envie para o backend aqui
      console.log("Submitting review:", newReview);
      setNewReview({ rating: 0, comment: "" });
      alert("Avaliação enviada com sucesso!");
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (

    <div className="bg-gradient-to-r from-[#003194] to-[#FFA62B] flex justify-center items-center min-h-screen ">
        <div className="w-full bg-[#FFFFFF] max-w-sm mx-auto rounded-lg shadow-md px-4">
          <div className="flex items-center justify-center p-6 gap-6">
            <img src={logo} alt="Logo Viagium" className="h-20" />
            <h2 className="text-2xl  font-bold">Escreva sua Avaliação</h2>
          </div>
          <div className="p-6">
          <form className="space-y-4" onSubmit={handleSubmitReview}>
            {/* Star Rating Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sua Avaliação</label>
              <div className="flex items-center gap-2">
                <StarRating
                  rating={newReview.rating}
                  onRate={(rating) => setNewReview((prev) => ({ ...prev, rating }))}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {newReview.rating > 0 ? `${newReview.rating}/5 estrelas` : "Clique para avaliar"}
                </span>
              </div>
            </div>

            {/* Comment Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Seu Comentário</label>
                <textarea
                  placeholder="Compartilhe sua experiência com este pacote de viagem..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                  className="w-full h-24 px-3 py-2 border rounded resize-none"
                />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-4 sm:w-auto bg-[#FFA62B] hover:bg-[#FF9500] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
              style={{ backgroundColor: '#FFA62B' }}
            >
              Enviar Avaliação
            </Button>
          </form>
        </div>
        </div>
    </div>
  );
}