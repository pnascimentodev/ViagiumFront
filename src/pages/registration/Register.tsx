// Register page
import { Button } from "../../components/Button.tsx";
import logo from "../../assets/img/logo.svg";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Input } from "../../components/Input.tsx";
import { useState } from "react";

function Register() {
  const [nome, setNome] = useState("");
  const [nomeError, setNomeError] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [sobrenomeError, setSobrenomeError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState("");
  const [confirmarEmailError, setConfirmarEmailError] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [confirmarSenhaError, setConfirmarSenhaError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");

  function validateEmail(email: string) {
    return /^[\w.-]+@(?:gmail|outlook|yahoo)\.com$/i.test(email);
  }

  function validateName(name: string) {
    return name.trim().length >= 2;
  }

  function handleNomeBlur() {
    if (nome && !validateName(nome)) {
      setNomeError("O nome deve ter pelo menos 2 caracteres.");
    } else if (nome && validateName(nome)) {
      setNomeError("");
    }
  }

  function handleSobrenomeBlur() {
    if (sobrenome && !validateName(sobrenome)) {
      setSobrenomeError("O sobrenome deve ter pelo menos 2 caracteres.");
    } else if (sobrenome && validateName(sobrenome)) {
      setSobrenomeError("");
    }
  }

  function handleEmailBlur() {
    if (email && !validateEmail(email)) {
      setEmailError("Digite um e-mail válido.");
    } else if (email && validateEmail(email)) {
      setEmailError("");
    }
  }

  function handleConfirmarEmailBlur() {
    if (confirmarEmail && confirmarEmail !== email) {
      setConfirmarEmailError("Os e-mails não coincidem.");
    } else if (confirmarEmail && confirmarEmail === email) {
      setConfirmarEmailError("");
    }
  }

  function handlePasswordBlur() {
    if (senha && senha.length < 6) {
      setSenhaError("A senha deve ter pelo menos 6 caracteres.");
    } else if (senha && senha.length >= 6) {
      setSenhaError("");
    }
  }

  function handleConfirmarSenhaBlur() {
    if (confirmarSenha && confirmarSenha !== senha) {
      setConfirmarSenhaError("As senhas não coincidem.");
    } else if (confirmarSenha && confirmarSenha === senha) {
      setConfirmarSenhaError("");
    }
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    
    // Reset errors
    setNomeError("");
    setSobrenomeError("");
    setEmailError("");
    setConfirmarEmailError("");
    setSenhaError("");
    setConfirmarSenhaError("");
    setTermsError("");

    let hasError = false;

    // Validate required fields
    if (!nome) {
      setNomeError("O nome é obrigatório.");
      hasError = true;
    } else if (!validateName(nome)) {
      setNomeError("O nome deve ter pelo menos 2 caracteres.");
      hasError = true;
    }

    if (!sobrenome) {
      setSobrenomeError("O sobrenome é obrigatório.");
      hasError = true;
    } else if (!validateName(sobrenome)) {
      setSobrenomeError("O sobrenome deve ter pelo menos 2 caracteres.");
      hasError = true;
    }

    if (!email) {
      setEmailError("O e-mail é obrigatório.");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Digite um e-mail válido.");
      hasError = true;
    }

    if (!confirmarEmail) {
      setConfirmarEmailError("A confirmação de e-mail é obrigatória.");
      hasError = true;
    } else if (confirmarEmail !== email) {
      setConfirmarEmailError("Os e-mails não coincidem.");
      hasError = true;
    }

    if (!senha) {
      setSenhaError("A senha é obrigatória.");
      hasError = true;
    } else if (senha.length < 6) {
      setSenhaError("A senha deve ter pelo menos 6 caracteres.");
      hasError = true;
    }

    if (!confirmarSenha) {
      setConfirmarSenhaError("A confirmação de senha é obrigatória.");
      hasError = true;
    } else if (confirmarSenha !== senha) {
      setConfirmarSenhaError("As senhas não coincidem.");
      hasError = true;
    }

    if (!termsAccepted) {
      setTermsError("Você deve concordar com os termos e condições.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Aqui você pode seguir com o registro (ex: chamar API)
    alert("Registro realizado com sucesso!");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFA62B]">
      <style>{`
        body { background: #FFA62B !important; }
        .mobile-image {
          display: none;
        }
        .desktop-image {
          display: block;
        }
        .form-side {
          width: 100%;
        }
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0px 25px;
        }
        @media (max-width: 700px) {
          .mobile-image {
            display: block;
          }
          .mobile-image img {
            border-radius: 35px;
            margin-top: 12px;
          }
          .logo-mobile {
            margin-top: 24px;
            margin-bottom: 10px;
          }
          .desktop-image {
            display: none;
          }
          .card-container {
            width: 100% !important;
            max-width: 420px !important;
            height: auto !important;
            min-height: 100vh;
            flex-direction: column !important;
            padding: 10px !important;
            box-sizing: border-box;
            margin: 32px auto !important;
          }
          .form-side {
            padding-left: 0 !important;
            padding-right: 0 !important;
            width: 100%;
            max-width: 100%;
          }
          .form-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            width: 100%;
          }
          .form-grid {
            display: flex;
            flex-direction: column;
            gap: 4px;
            width: 100%;
          }
          .form-grid > div {
            margin-bottom: 4px !important;
          }
          .input-pair {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          form {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
        }
        @media (min-width: 701px) {
          form {
            margin-top: 10px !important;
            margin-bottom: 10px !important;
          }
          .login-link-desktop {
            margin-bottom: -30px !important;
            margin-top: 0 !important;
          }
          .register-btn-desktop {
            margin-top: -5px !important;
            margin-bottom: -18px !important;
          }
          .terms-desktop {
           
          }
        }
      `}</style>

      {/* Card branco centralizado */}
      <div
        className="bg-white rounded-3xl shadow-lg w-[980px] h-[540px] flex flex-row p-0 card-container"
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Lado esquerdo - Imagem (só desktop/tablet) */}
        <div className="desktop-image flex-1 flex items-center justify-center h-full" style={{ minWidth: 0 }}>
          <div
            className="w-full h-[90%] flex items-center justify-center"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '90%',
              width: '100%',
              padding: 0,
            }}
          >
            <img
              src="https://images.pexels.com/photos/13644895/pexels-photo-13644895.jpeg"
              alt="Venice Canal"
              style={{
                borderRadius: '20px',
                boxShadow: '0 15px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
                width: '75%',
                height: '75%',
                objectFit: 'cover',
                objectPosition: 'center',
                marginTop: '30px',
              }}
            />
          </div>
        </div>

        {/* Imagem Mobile - Só aparece em telas menores que 700px */}
        <div className="w-full mobile-image">
            <img
              src="https://images.pexels.com/photos/13644895/pexels-photo-13644895.jpeg"
              alt="Imagem mobile"
              className="w-full h-[180px] object-cover"
            />
        </div>

        {/* Lado direito - Formulário */}
        <div className="flex-1 p-8 flex flex-col justify-center form-side" style={{ minWidth: 0, paddingLeft: '30px' }}>
          {/* Logo */}
          <div className="logo-mobile" style={{ marginLeft: '145px' }}> 
            <img src={logo} alt="Logo Viagium" className="h-15" />
          </div>

          {/* Formulário */}
          <form onSubmit={handleRegister} className="w-full max-w-[500px] form-container" style={{ marginTop: '5px', marginLeft: '-50px' }}>
            <div className="form-grid" style={{ marginTop: '5px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Input
                  type="text"
                  placeholder="NOME"
                  icon={<FaUser size={14} />}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={handleNomeBlur}
                />
                {nomeError && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{nomeError}</span>}
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="SOBRENOME"
                  icon={<FaUser size={14} />}
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  onBlur={handleSobrenomeBlur}
                />
                {sobrenomeError && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{sobrenomeError}</span>}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <Input
                  type="email"
                  placeholder="EMAIL"
                  icon={<FaEnvelope size={14} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                />
                {emailError && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{emailError}</span>}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="CONFIRMAR EMAIL"
                  icon={<FaEnvelope size={14} />}
                  value={confirmarEmail}
                  onChange={(e) => setConfirmarEmail(e.target.value)}
                  onBlur={handleConfirmarEmailBlur}
                />
                {confirmarEmailError && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{confirmarEmailError}</span>}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <Input
                  type="password"
                  placeholder="SENHA"
                  icon={<FaLock size={14} />}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onBlur={handlePasswordBlur}
                />
                {senhaError && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{senhaError}</span>}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="CONFIRMAR SENHA"
                  icon={<FaLock size={14} />}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  onBlur={handleConfirmarSenhaBlur}
                />
                {confirmarSenhaError && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{confirmarSenhaError}</span>}
              </div>
            </div>

            {/* Checkbox de termos */}
            <div className="mt-6 text-sm text-gray-700 terms-desktop" style={{  }}>
              <label className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  className="mt-1 flex-shrink-0"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
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
              {termsError && <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>{termsError}</span>}
            </div>

            {/* Botão */}
            <div className="mt-6 w-full max-w-[250px] mx-auto register-btn-desktop">
              <Button
                type="submit"
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
            <div className="text-center mt-6 login-link-desktop">
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;