// Register page
import { Button } from "../../components/Button.tsx";
import logo from "../../assets/img/logo.svg";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Input } from "../../components/Input.tsx";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFA62B]">
      <style>{`body { background: #FFA62B !important; }`}</style>

      {/* Card branco centralizado */}
      <div
        className="bg-white rounded-3xl shadow-lg w-[980px] h-[500px] flex p-6"
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Lado esquerdo - Imagem */}
        <div className="w-[410px] h-full flex items-center justify-center p-8">
          <div
            className="w-[320px] h-[410px] overflow-hidden"
            style={{
              borderRadius: '20px',
              boxShadow: '0 15px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            <img
              src="https://images.pexels.com/photos/13644895/pexels-photo-13644895.jpeg"
              alt="Venice Canal"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        
        {/* Lado direito - Formulário */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex justify-center mb-8" style={{ marginBottom: '10px' }}> 
            <img src={logo} alt="Logo Viagium" className="h-15" />
          </div>

          {/* Formulário */}
          <div className="w-full max-w-[500px] mx-auto"> 
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '0px 20px',
              marginTop: 'px' 
            }}>
              <div style={{ marginBottom: '12px' }}>
                <Input
                  type="text"
                  placeholder="NOME"
                  icon={<FaUser size={14} />}
                />
                </div>          
                <Input
                  type="text"
                  placeholder="SOBRENOME"

                  icon={<FaUser size={14} />}
                />
              <div style={{ marginBottom: '12px' }}>
                <Input
                  type="email"
                  placeholder="EMAIL"
                  icon={<FaEnvelope size={14} />}
                />
              </div>
                <Input
                  type="email"
                  placeholder="CONFIRMAR EMAIL"
                  icon={<FaEnvelope size={14} />}
                />
              
               <div style={{ marginBottom: '12px' }}>
                <Input
                  type="password"
                  placeholder="SENHA"
                  icon={<FaLock size={14} />}
                />
              </div>
              <Input
                type="password"
                placeholder="CONFIRMAR SENHA"
                icon={<FaLock size={14} />}
              />
            </div>

            {/* Checkbox de termos */}
            <div className="mt-6 text-sm text-gray-700">
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 flex-shrink-0" />
                <span>
                  Declaro ter{" "}
                  <span className="font-bold text-[#003194]">mais de 16 anos de idade</span>{" "}
                  e concordo com os{" "}
                  <a href="#" className="text-[#003194] font-bold hover:underline">
                    Termos e Condições
                  </a>. Leia nossa{" "}
                  <a href="#" className="text-[#003194] font-bold hover:underline">
                    Política de Privacidade
                  </a>{" "}
                  e saiba sobre o tratamento dos seus dados pessoais.
                </span>
              </label>
            </div>

            {/* Botão */}
            <div className="mt-6 w-full max-w-[250px] mx-auto">
              <Button
                style={{
                  fontSize: 16,
                  height: 48,
                  width: '100%',
                  borderRadius: 10,
                  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.10)',
                  marginTop: '10px',
                  backgroundColor: '#003194',
                  color: 'white',
                  fontWeight: '600',
                }}
              >
                REGISTRE-SE
              </Button>
            </div>

            {/* Link para login */}
            <div className="text-center mt-6">
              <p className="text-base text-[#003194]" style={{ fontWeight: "400" }}>
                Já possui uma conta?{" "}
                <a
                  href="#"
                  className="font-bold text-[#003194] hover:underline transition-all hover:text-[#FFA62B]"
                  style={{ textDecoration: "none", fontWeight: "700" }}
                >
                  Faça login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;