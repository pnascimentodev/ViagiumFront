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
    <div className="min-h-screen flex justify-center items-center
    bg-gradient-to-b from-[#FFA62B] to-[#003194]">

      <div className="flex flex-col md:flex-row items-center bg-white p-4 md:p-8 m-4 gap-8 rounded-4xl shadow-lg min-h-[80vh] w-[95vw] md:w-[80vw] max-w-6xl">

        <img src="https://images.pexels.com/photos/13644895/pexels-photo-13644895.jpeg" alt="Background" className="w-full md:w-1/3 h-48 md:h-[75vh] object-cover rounded-4xl" />

        <form onSubmit={handleRegister} className="w-full md:w-2/3 flex flex-col gap-8 px-4 md:px-0 h-full justify-between items-center">
          <img src={logo} alt="Logo Viagium" className="w-[100px] h-auto" />

          <div className="w-full flex flex-col gap-4">
            {/* Nome e Sobrenome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  placeholder="NOME"
                  icon={<FaUser size={14} />}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={handleNomeBlur}
                />
                {nomeError && <span className="text-red-500 text-sm">{nomeError}</span>}
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
                {sobrenomeError && <span className="text-red-500 text-sm">{sobrenomeError}</span>}
              </div>
            </div>

            {/* Email e Confirmar Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="email"
                  placeholder="EMAIL"
                  icon={<FaEnvelope size={14} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                />
                {emailError && <span className="text-red-500 text-sm">{emailError}</span>}
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
                {confirmarEmailError && <span className="text-red-500 text-sm">{confirmarEmailError}</span>}
              </div>
            </div>

            {/* Senha e Confirmar Senha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="password"
                  placeholder="SENHA"
                  icon={<FaLock size={14} />}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onBlur={handlePasswordBlur}
                />
                {senhaError && <span className="text-red-500 text-sm">{senhaError}</span>}
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
                {confirmarSenhaError && <span className="text-red-500 text-sm">{confirmarSenhaError}</span>}
              </div>
            </div>
          </div>


          {/* Termos e Condições */}
          <div className="mb-6">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 flex-shrink-0"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className="text-sm">
                Declaro ter <strong>mais de 16 anos de idade</strong> e concordo com os{" "}
                <a href="#" className="font-semibold hover:text-[#FFA62B]">
                  Termos e Condições
                </a>. Leia nossa{" "}
                <a href="#" className="font-semibold hover:text-[#FFA62B]">
                  Política de Privacidade
                </a>{" "}
                e saiba sobre o tratamento dos seus dados pessoais.
              </span>
            </label>
            {termsError && <span className="text-red-500 text-sm block mt-2">{termsError}</span>}
          </div>

          {/* Botão de Submit */}
          <div className="max-w-[300px] w-full">
            <Button type="submit">
              REGISTRE-SE
            </Button>
          </div>

          {/* Link para Login */}
          <div className="text-center">
            <p className="text-sm">
              Já possui uma conta?{" "}
              <a href="#" className="font-semibold hover:text-[#FFA62B]">
                Faça login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;