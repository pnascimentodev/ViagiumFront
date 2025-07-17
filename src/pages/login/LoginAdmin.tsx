
import { Button } from "../../components/Button.tsx";
import logo from "../../assets/img/logo.svg";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Input } from "../../components/Input.tsx";
import { useState } from "react";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  function validateEmail(email: string) {

      return /^[\w.-]+@(?:viagium)\.com$/i.test(email);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !senha) {
      setError("Preencha todos os campos.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Digite um e-mail válido.");
      return;
    }
    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setError("");
    // Aqui você pode seguir com o login (ex: chamar API)
    alert("Login realizado com sucesso!");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#003194]">
      <style>{`body { background: #FFA62B !important; }`}</style>
      <div className="bg-white rounded-3xl shadow-lg w-[400px] p-8 flex flex-col items-center" style={{
        backgroundColor: 'white',
        minHeight: '500px',
        borderRadius: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="flex justify-center mb-12" style={{ marginTop: '35px' }}>
          <img src={logo} alt="Logo Viagium" className="h-20" />
        </div>
        <form className="w-full flex flex-col items-center" onSubmit={handleLogin}>
          <div className="w-full max-w-[320px]" style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <Input
                type="email"
                placeholder="EMAIL"
                icon={<FaEnvelope size={16} />}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <Input
              type="password"
              placeholder="SENHA"
              icon={<FaLock size={16} />}
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
            {error && (
              <div style={{ color: "red", marginTop: 10, fontWeight: 500 }}>
                {error}
              </div>
            )}
            <div className="mt-4">
              <Button
                style={{
                  fontSize: 16,
                  height: 48,
                  width: '100%',
                  borderRadius: 10,
                  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.10)',
                  marginTop: '20px',
                }}
                type="submit"
              >
                ENTRAR
              </Button>
            </div>
          </div>
        </form>
        {/* Links */}
        <div className="w-full text-center space-y-4 mt-8">
          <a
            href="#"
            className="text-[#003194] font-bold text-base hover:underline transition-all block hover:text-[#FFA62B]"
            style={{
              textDecoration: 'none',
              fontWeight: '700',
              marginTop: '20px',
            }}
          >
            Esqueceu sua senha?
          </a>
        </div>
      </div>
    </div>
  );
}
export default LoginAdmin; 
