import { Button } from "../../components/Button.tsx";
import { Input } from "../../components/Input.tsx";
import logo from '../../assets/img/logo.svg';
import { FaEnvelope, FaLock } from 'react-icons/fa';

function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-400">
            <div className="bg-white p-8 rounded-xl shadow-md w-80">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo Viagium" className="h-16" />
                </div>

                {/* Inputs com ícones */}
                <Input
                    type="email"
                    placeholder="Email"
                    icon={<FaEnvelope size={14} />}
                />
                <Input
                    type="password"
                    placeholder="Senha"
                    icon={<FaLock size={14} />}
                />

                {/* Botão */}
                <Button>ENTRAR</Button>

                {/* Links */}
                <p className="text-center text-sm mt-4 text-blue-900 font-semibold cursor-pointer hover:underline">
                    Esqueceu sua senha?
                </p>
                <p className="text-center text-sm mt-2 text-gray-800">
                    Não tem conta Viagium?{" "}
                    <span className="font-bold text-blue-900 cursor-pointer hover:underline">
                        Crie sua conta
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Login;
