// Register page
import { Button } from "../../components/Button.tsx";
import logo from "../../assets/img/logo.svg";
import {FaEnvelope, FaLock, FaUser, FaPhone, FaIdCard, FaBirthdayCake} from "react-icons/fa";
import { Input } from "../../components/Input.tsx";
import { useState } from "react";
import axios from "axios";

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

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthDateError, setBirthDateError] = useState("");

  function validateEmail(email: string) {
    return /^[\w.-]+@(?:gmail|outlook|yahoo)\.com$/i.test(email);
  }

  function validateName(name: string) {
    return name.trim().length >= 1;
  }

  function handleNomeBlur() {
    if (nome && !validateName(nome)) {
      setNomeError("Insira seu nome.");
    } else if (nome && validateName(nome)) {
      setNomeError("");
    }
  }

  function handleSobrenomeBlur() {
    if (sobrenome && !validateName(sobrenome)) {
      setSobrenomeError("Insira seu sobrenome.");
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
    if (senha && senha.length < 8) {
      setSenhaError("A senha deve ter pelo menos 8 caracteres.");
    } else if (senha && senha.length >= 8) {
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

  // Função para formatar CPF
  function formatCPF(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  // Função para formatar telefone
  function formatPhone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;

    // Nome
    if (!nome || !validateName(nome)) {
      setNomeError("Insira seu nome.");
      valid = false;
    } else {
      setNomeError("");
    }

    // Sobrenome
    if (!sobrenome || !validateName(sobrenome)) {
      setSobrenomeError("Insira seu sobrenome.");
      valid = false;
    } else {
      setSobrenomeError("");
    }

    // Email
    if (!email) {
      setEmailError("Digite um e-mail.");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Digite um e-mail válido.");
      valid = false;
    } else {
      setEmailError("");
    }

    // Confirmar Email
    if (!confirmarEmail) {
      setConfirmarEmailError("Confirme seu e-mail.");
      valid = false;
    } else if (confirmarEmail !== email) {
      setConfirmarEmailError("Os e-mails não coincidem.");
      valid = false;
    } else {
      setConfirmarEmailError("");
    }

    // Senha
    if (!senha) {
      setSenhaError("Digite uma senha.");
      valid = false;
    } else if (senha.length < 8) {
      setSenhaError("A senha deve ter pelo menos 8 caracteres.");
      valid = false;
    } else {
      setSenhaError("");
    }

    // Confirmar Senha
    if (!confirmarSenha) {
      setConfirmarSenhaError("Confirme sua senha.");
      valid = false;
    } else if (confirmarSenha !== senha) {
      setConfirmarSenhaError("As senhas não coincidem.");
      valid = false;
    } else {
      setConfirmarSenhaError("");
    }

    // Telefone
    if (!phone) {
      setPhoneError("Digite seu telefone.");
      valid = false;
    } else {
      setPhoneError("");
    }

    // Documento
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const passportRegex = /^[A-Za-z0-9]{6,12}$/;
    if (!documentNumber || (!cpfRegex.test(documentNumber) && !passportRegex.test(documentNumber))) {
      setDocumentError("Digite um CPF (xxx.xxx.xxx-xx) ou Passaporte válido.");
      valid = false;
    } else {
      setDocumentError("");
    }

    // Data de nascimento
    if (!birthDate) {
      setBirthDateError("Informe sua data de nascimento.");
      valid = false;
    } else {
      setBirthDateError("");
    }

    // Termos
    if (!termsAccepted) {
      setTermsError("Você deve aceitar os termos.");
      valid = false;
    } else {
      setTermsError("");
    }

    if (!valid) return;

    // Aqui você pode seguir com o registro (ex: chamar API)
    try {
      await axios.post("http://localhost:5028/api/User", {
        firstName: nome,
        lastName: sobrenome,
        email: email,
        password: senha,
        phone: phone,
        documentNumber: documentNumber,
        birthDate: birthDate,
      });
      alert("Registro realizado com sucesso!");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Erro ao registrar.");
    }
  }

  return (
      <div className="min-h-screen flex justify-center items-center
    bg-gradient-to-b from-[#FFA62B] to-[#003194]">

        <div
            className="flex flex-col md:flex-row items-center bg-white p-4 md:p-8 m-4 gap-8 rounded-4xl shadow-lg min-h-[80vh] w-[95vw] md:w-[80vw] max-w-6xl">

          <img src="https://images.pexels.com/photos/13644895/pexels-photo-13644895.jpeg" alt="Background"
               className="w-full md:w-1/3 h-48 md:h-[700px] object-cover rounded-4xl"/>

          <form onSubmit={handleRegister}
                className="w-full md:w-2/3 flex flex-col gap-8 px-4 md:px-0 h-full justify-between items-center">
            <img src={logo} alt="Logo Viagium" className="w-[100px] h-auto"/>

            <div className="w-full flex flex-col gap-4">
              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                      type="text"
                      placeholder="Nome"
                      icon={<FaUser size={14}/>}
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      onBlur={handleNomeBlur}
                  />
                  {nomeError && <span className="text-red-500 text-sm">{nomeError}</span>}
                </div>

                <div>
                  <Input
                      type="text"
                      placeholder="Sobrenome"
                      icon={<FaUser size={14}/>}
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
                      placeholder="Email"
                      icon={<FaEnvelope size={14}/>}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={handleEmailBlur}
                  />
                  {emailError && <span className="text-red-500 text-sm">{emailError}</span>}
                </div>

                <div>
                  <Input
                      type="email"
                      placeholder="Confirmar email"
                      icon={<FaEnvelope size={14}/>}
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
                      placeholder="Senha"
                      icon={<FaLock size={14}/>}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      onBlur={handlePasswordBlur}
                  />
                  {senhaError && <span className="text-red-500 text-sm">{senhaError}</span>}
                </div>

                <div>
                  <Input
                      type="password"
                      placeholder="Confirmar"
                      icon={<FaLock size={14}/>}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      onBlur={handleConfirmarSenhaBlur}
                  />
                  {confirmarSenhaError && <span className="text-red-500 text-sm">{confirmarSenhaError}</span>}
                </div>
              </div>

              {/* Telefone, Documento e Data de Nascimento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div>
                  <Input
                      type="text"
                      placeholder="Telefone"
                      icon={<FaPhone size={14}/>}
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                  />
                  {phoneError && <span className="text-red-500 text-sm">{phoneError}</span>}
                </div>
                <div>
                  <Input
                      type="text"
                      placeholder="CPF ou Passaporte"
                      icon={<FaIdCard size={14}/>}
                      value={documentNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        const onlyNumbers = value.replace(/\D/g, "");
                        // CPF: só números, exatamente 11 dígitos
                        if (/^\d{11}$/.test(onlyNumbers)) {
                          setDocumentNumber(formatCPF(onlyNumbers));
                        } else if (/^[A-Za-z0-9]{6,12}$/.test(value)) {
                          // Passaporte: letras e números juntos, 6 a 12 caracteres
                          setDocumentNumber(value.toUpperCase());
                        } else {
                          setDocumentNumber(value);
                        }
                      }}
                  />
                  {documentError && <span className="text-red-500 text-sm">{documentError}</span>}
                </div>
                <div>
                  <Input
                      type="date"
                      placeholder="Data de Nascimento"
                      icon={<FaBirthdayCake size={18}/>}
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                  />
                  {birthDateError && <span className="text-red-500 text-sm">{birthDateError}</span>}
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
                <a href="/client" className="font-semibold hover:text-[#FFA62B]">
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