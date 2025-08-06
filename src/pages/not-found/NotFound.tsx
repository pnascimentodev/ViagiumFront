import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Button from '@mui/material/Button';
import Traveler from '../../assets/img/traveler.png';

function NotFound() {
    return (
        <div className="w-full min-h-screen bg-white">
            <div className="fixed top-0 left-0 w-full z-50 bg-white">
                <Navbar />
            </div>
            <div className="relative flex flex-col items-center justify-center h-screen gap-4">
                <img src={Traveler} alt="Traveler" className="w-1/4 mb-8" />
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-2xl mb-6">Ops! Essa página não foi encontrada :(</p>
                <Link to="/" className="text-blue-500 underline">
                    <Button variant="contained" style={{ backgroundColor: '#003194', color: '#fff', height: '50px', width: '200px', borderRadius: '12px' }}>
                        Voltar para a Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default NotFound;