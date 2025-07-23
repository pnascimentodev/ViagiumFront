import {Button} from "../../components/Button.tsx";
import {Input} from "../../components/Input.tsx";
import logo from '../../assets/img/logo.svg';


function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-400">
            <div className="bg-white p-8 rounded-xl shadow-md w-80">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo Viagium" className="h-16" />
                </div>

                {/* Inputs */}
                <Input
                    type="email"
                    placeholder="Email"
                />
                <Input
                    type="password"
                    placeholder="Senha"
                />

                {/* Botão personalizado */}
                <Button>Entrar</Button>

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

export default Login
