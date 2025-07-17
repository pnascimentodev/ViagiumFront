// Login page
import { Button } from "../../components/Button.tsx";
import logo from "../../assets/img/logo.svg";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Input } from "../../components/Input.tsx";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFA62B] font-montserrat">
      <style>{`body { background: #FFA62B !important; }`}</style>
      {/* Card branco centralizado */}
      <div className="bg-white rounded-3xl shadow-lg w-[400px] p-8 flex flex-col items-center" style={{ 
        backgroundColor: 'white',
        minHeight: '500px',
        borderRadius: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <img src={logo} alt="Logo Viagium" className="h-20" />
        </div>
       {/* Formulário */}
<div className="w-full flex flex-col items-center">
  <div className="w-full max-w-[320px]">
    <Input
      type="email"
      placeholder="EMAIL"
      icon={<FaEnvelope size={16} />}
    />
    <Input
      type="password"
      placeholder="SENHA"
      icon={<FaLock size={16} />}
    />
    <div className="mt-4">
      <Button
        style={{
          fontSize: 16,
          height: 48,
          width: '100%',
          borderRadius: 10,
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.10)',
        }}
      >
        ENTRAR
      </Button>
    </div>
  </div>
</div>

        {/* Links */}
        <div className="w-full text-center space-y-4 mt-8">
          <a
            href="#"
            className="text-[#003194] font-bold text-base hover:underline transition-all block"
            style={{ textDecoration: 'none' }}
          >
            Esqueceu sua senha?
          </a>
          <p className="text-base text-[#003194] font-normal">
            Não tem conta Viagium?{' '}
            <a
              href="#"
              className="font-bold text-[#003194] hover:underline transition-all"
              style={{ textDecoration: 'none' }}
            >
              Crie sua conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login; 