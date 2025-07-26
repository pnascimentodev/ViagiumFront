import { useState } from "react";
import ModalHotel from "../affiliate/components/ModalHotel";
import { Button } from "../../components/Button";


// PAGINA TESTE DE MODAL HOTEL COM BOTAO
function AffiliateDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="admin-dashboard">
            <h1>Dashboard Afiliado para teste</h1>

            <div className="relative z-10 text-center" >
                <div className="absolute top-0 right-0 m-6">
                    {/* Botao add hotel */}
                    <Button
                        onClick={handleOpenModal}
                        className="bg-[#003194] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#002a7a] transition-colors duration-200 shadow-lg"
                    >
                        + Cadastrar Novo Hotel
                    </Button>

                    {/* Modal de cadastro */}
                    <ModalHotel
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                    />
                </div>
            </div>
        </div>
    );
}
export default AffiliateDashboard;
