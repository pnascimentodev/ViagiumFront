// Login page
import { Button } from "../../components/Button.tsx";
import logo from "../../assets/img/logo.svg";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Input } from "../../components/Input.tsx";
import { useState } from "react";

function LoginClient() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaError, setSenhaError] = useState("");


  function validateEmail(email: string) {
    return /^[\w.-]+@(?:gmail|outlook|yahoo)\.com$/i.test(email);
  }

  function handleEmailBlur() {
    if (email && !validateEmail(email)) {
      setEmailError("Digite um e-mail válido.");
    } else if (email && validateEmail(email)) {
      setEmailError("");
    }
  }

  function handlePasswordBlur() {
    if (senha && senha.length < 6) {
      setSenhaError("A senha deve ter pelo menos 6 caracteres.");
    } else if (senha && senha.length >= 6) {
      setSenhaError("");
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !senha) {
      setEmailError("Preencha todos os campos.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Digite um e-mail válido.");
      return;
    }
    if (senha.length < 6) {
      setSenhaError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setEmailError("");
    setSenhaError("");
    // Aqui você pode seguir com o login (ex: chamar API)
    alert("Login realizado com sucesso!");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFA62B]">
      <div className="flex flex-col rounded-3xl shadow-lg w-[400px] justify-center" style={{
        backgroundColor: 'white',
        minHeight: '500px',
        borderRadius: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        gap: '30px',
      }}>
        <div className="flex justify-center">
          <img src={logo} alt="Logo Viagium" className="h-20"/>
        </div>

        <form className="w-full flex flex-col items-center" onSubmit={handleLogin}>
          <div className="w-full max-w-[320px] flex flex-col" style={{gap: '8px'}}>
            <div>
              <Input
                type="email"
                placeholder="EMAIL"
                icon={<FaEnvelope size={16} />}
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                hasError={!!emailError}
              />
            </div>
            {emailError && (
              <div style={{ color: "red", fontWeight: 500 }}>
                {emailError}
              </div>
            )}
            <Input
              type="password"
              placeholder="SENHA"
              icon={<FaLock size={16} />}
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onBlur={handlePasswordBlur}
              hasError={!!senhaError}
            />
            {senhaError && (
              <div style={{ color: "red", fontWeight: 500 }}>
                {senhaError}
              </div>
            )}
            <div>
              <Button
                style={{
                  fontSize: 16,
                  height: 48,
                  width: '100%',
                  borderRadius: 10,
                  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.10)',
                }}
                type="submit"
              >
                ENTRAR
              </Button>
            </div>
          </div>
        </form>
        {/* Links */}
        <div className="w-full text-center">
          <a
            href="#"
            className="text-[#003194] font-bold text-base hover:underline transition-all block hover:text-[#FFA62B]"
            style={{
              textDecoration: 'none',
              fontWeight: '700',
            }}
          >
            Esqueceu sua senha?
          </a>
          <p className="text-base text-[#003194]" style={{ fontWeight: '400' }}>
            Não tem conta Viagium?{' '}
            <a
              href="#"
              className="font-bold text-[#003194] hover:underline transition-all hover:text-[#FFA62B]"
              style={{ textDecoration: 'none', fontWeight: '700' }}
            >
              Crie sua conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginClient;