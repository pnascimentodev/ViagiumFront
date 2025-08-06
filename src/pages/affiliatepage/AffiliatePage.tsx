import { FaCalendarAlt, FaChartLine, FaPercentage, FaUsers, FaShieldAlt, FaBullhorn } from "react-icons/fa";
import HotelCarousel from "../../components/HotelCarousel";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";
import axios from "axios";
import { validateEmail, validatePassword, validatePhone, validateCEP, validateCNPJ, validateRequired, validateEmailConfirmation, validatePasswordConfirmation, validateTerms } from "../../utils/validations.ts";
import { maskPhone, maskCEP, maskCNPJ, maskInscricaoEstadual, maskCPF, maskPassaporte } from "../../utils/masks.ts";
import { validateCPF, validatePassaporte } from "../../utils/validations.ts";
import { fetchAddressByCEP } from "../../utils/cepApi";
import type { AddressData } from "../../utils/cepApi";
import Footer from "../../components/Footer.tsx";
import Navbar from "../../components/Navbar.tsx";

function AffiliatePage() {
  const [form, setForm] = useState({
    companyName: "",
    tradeName: "",
    phone1: "",
    phone2: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    zipCode: "",
    street: "",
    addressNumber: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    cnpj: "",
    stateRegistration: "",
    terms: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  async function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    let newValue = value;
    switch (name) {
      case "phone1":
      case "phone2":
        newValue = maskPhone(value);
        break;
      case "zipCode":
        newValue = maskCEP(value);
        break;
      case "cnpj":
        newValue = maskCNPJ(value);
        break;
      case "stateRegistration":
        newValue = maskInscricaoEstadual(value);
        break;
      case "cpfPassaporte": {
        const onlyNumbers = value.replace(/\D/g, "");
        // CPF: só números, até 11 dígitos
        if (/^\d{1,11}$/.test(onlyNumbers) && onlyNumbers.length > 0) {
          newValue = maskCPF(onlyNumbers);
        } else if (/^[A-Za-z0-9]{6,12}$/.test(value)) {
          // Passaporte: letras e números juntos, 6 a 12 caracteres
          newValue = maskPassaporte(value);
        } else {
          newValue = value;
        }
        break;
      }
      default:
        // outros campos sem máscara
        break;
    }

    setForm(prev => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : newValue };
      return updated;
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    // Busca automática de endereço ao digitar CEP completo
    if (name === "zipCode") {
      const cleanCep = newValue.replace(/\D/g, "");
      if (cleanCep.length === 8) {
        try {
          const address: AddressData = await fetchAddressByCEP(cleanCep);
          setForm(prev => ({
            ...prev,
            zipCode: maskCEP(address.cep),
            street: address.address || "",
            neighborhood: address.district || "",
            city: address.city || "",
            state: address.state || "",
            // country pode ser "Brasil" por padrão
            country: prev.country || "Brasil"
          }));
        } catch {
          // Opcional: exibir erro de CEP não encontrado
          setErrors(prev => ({ ...prev, zipCode: "CEP não encontrado." }));
        }
      }
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    let error = "";
    switch (name) {
      case "cpfPassaporte": {
        const onlyNumbers = value.replace(/\D/g, "");
        if (onlyNumbers.length === 11) {
          if (!validateCPF(value)) error = "CPF inválido.";
        } else {
          if (!validatePassaporte(value)) error = "Passaporte inválido (mín. 6 caracteres).";
        }
        break;
      }
      case "email":
        if (!validateEmail(value)) error = "Digite um e-mail válido.";
        break;
      case "confirmEmail":
        error = validateEmailConfirmation(form.email, value) || "";
        break;
      case "password":
        error = validatePassword(value) || "";
        break;
      case "confirmPassword":
        error = validatePasswordConfirmation(form.password, value) || "";
        break;
      case "phone1":
        if (!validatePhone(value)) error = "Telefone inválido.";
        break;
      case "phone2":
        break;
      case "zipCode":
        if (!validateCEP(value)) error = "CEP inválido.";
        break;
      case "cnpj":
        if (!validateCNPJ(value)) error = "CNPJ inválido.";
        break;
      default:
        if (!validateRequired(value)) error = "Campo obrigatório.";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    // Validação de todos os campos
    if (!validateRequired(form.companyName)) newErrors.companyName = "Campo obrigatório.";
    if (!validateRequired(form.tradeName)) newErrors.tradeName = "Campo obrigatório.";
    if (!validatePhone(form.phone1)) newErrors.phone1 = "Telefone inválido.";
    if (form.phone2 && !validatePhone(form.phone2)) newErrors.phone2 = "Telefone inválido.";
    if (!validateEmail(form.email)) newErrors.email = "Digite um e-mail válido.";
    const emailConf = validateEmailConfirmation(form.email, form.confirmEmail);
    if (emailConf) newErrors.confirmEmail = emailConf;
    const passwordVal = validatePassword(form.password);
    if (passwordVal) newErrors.password = passwordVal;
    const passwordConf = validatePasswordConfirmation(form.password, form.confirmPassword);
    if (passwordConf) newErrors.confirmPassword = passwordConf;
    if (!validateCEP(form.zipCode)) newErrors.zipCode = "CEP inválido.";
    if (!validateRequired(form.street)) newErrors.street = "Campo obrigatório.";
    if (!validateRequired(form.addressNumber)) newErrors.addressNumber = "Campo obrigatório.";
    if (!validateRequired(form.neighborhood)) newErrors.neighborhood = "Campo obrigatório.";
    if (!validateRequired(form.city)) newErrors.city = "Campo obrigatório.";
    if (!validateRequired(form.state)) newErrors.state = "Campo obrigatório.";
    if (!validateRequired(form.country)) newErrors.country = "Campo obrigatório.";
    if (!validateCNPJ(form.cnpj)) newErrors.cnpj = "CNPJ inválido.";
    if (!validateRequired(form.stateRegistration)) newErrors.stateRegistration = "Campo obrigatório.";
    if (!validateTerms(form.terms)) newErrors.terms = "Você deve aceitar os termos.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const data = {
      name: form.tradeName,
      cnpj: form.cnpj,
      companyName: form.companyName,
      email: form.email,
      phone: form.phone1,
      stateRegistration: form.stateRegistration,
      hashPassword: form.password,
      address: {
        streetName: form.street,
        addressNumber: Number(form.addressNumber),
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        country: form.country
      }
    };

    axios.post("http://localhost:5028/api/affiliate/create", data)
      .then(() => {
        alert("Cadastro realizado com sucesso!");
      })
      .catch((error) => {
        const msg = error.response?.data?.message || error.message || "Erro ao cadastrar afiliado.";
        alert(msg);
      });
  }

  return (

    <div className="bg-[#003194] flex flex-col gap-y-5">

      {/* Background image */}
      <div className="bg-cover bg-center bg-no-repeat bg-[url('https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg')]">

        <div className="flex flex-col bg-gradient-to-b from-[#00319400] to-[#003194FF]">

          <Navbar navType="affiliatePage" />

          {/* Hero Section */}
          <div className="flex flex-col justify-center items-center text-center max-w-3xl mx-auto h-[50vh] p-5 gap-4">
            <p className="text-xl md:text-2xl text-white  mb-2 ">
              Temos alta demanda de hospedagens. O que falta para <br />você anunciar a sua?
            </p>
            <h1 className="text-4xl md:text-5xl text-white  font-bold tracking-wider">TORNE-SE UM AFILIADO</h1>
          </div>
        </div>
      </div>

      {/* Card vantagens */}
      <div id="vantagens" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full px-5 py-10 mx-auto">
        {/* Card 1 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform">
          <div className="text-blue-500 mb-4">
            <FaCalendarAlt className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Acompanhe suas reservas em tempo real</h3>
          <p className="text-blue-900 text-sm leading-relaxed">
            Dashboard exclusivo com todas as reservas feitas no seu hotel
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform">
          <div className="text-blue-500 mb-4">
            <FaChartLine className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Ganhos mensais garantidos</h3>
          <p className="text-blue-900 text-sm leading-relaxed">
            Receba comissões mensais pelas reservas feitas pelos clientes
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform">
          <div className="text-blue-500 mb-4">
            <FaPercentage className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Alta lucratividade com baixa taxa</h3>
          <p className="text-blue-900 text-sm leading-relaxed">Apenas 10% sobre o valor da reserva</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform">
          <div className="text-blue-500 mb-4">
            <FaUsers className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Cresça junto com a rede de parceiros</h3>
          <p className="text-blue-900 text-sm leading-relaxed">Expanda seus serviços e alcance mais viajantes</p>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform">
          <div className="text-blue-500 mb-4">
            <FaShieldAlt className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Sem burocracia para cadastrar</h3>
          <p className="text-blue-900 text-sm leading-relaxed">Cadastre-se, compartilhe e venda. Simples assim!</p>
        </div>

        {/* Card 6 */}
        <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform">
          <div className="text-blue-500 mb-4">
            <FaBullhorn className="h-12 w-12" />
          </div>
          <h3 className="text-orange-500 font-semibold text-lg mb-2">Divulgação ativa do seu hotel</h3>
          <p className="text-blue-900 text-sm leading-relaxed">
            Seu hotel ganha visibilidade na nossa rede e é promovido diretamente para viajantes
          </p>
        </div>
      </div>


      {/* Carrossel */}
      <div id="nossos-parceiros" className="w-full flex flex-col items-center px-5 py-20 bg-[#002673]">
        <h2 className="text-5xl font-bold text-[#ffffff] mb-15">Nossos parceiros</h2>
        <div className="max-w-6xl w-full px-5 py-10 mx-auto">
          <HotelCarousel />
        </div>
      </div>

      {/* Formulário de Afiliados */}
      <div id="cadastre-se" className="w-full max-w-6xl mx-auto p-6 mt-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-[#003194] mb-8 text-left">Cadastro do afiliado</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>

            <h2 className="text-xl text-[#003194] mb-8 text-left">Dados da empresa</h2>
            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-[#003194] mb-2">
                  Razão Social
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="Ex: Hotelaria Brasil Ltda"
                  value={form.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.companyName && <div style={{ color: "red", fontWeight: 500 }}>{errors.companyName}</div>}
              </div>
              <div>
                <label htmlFor="tradeName" className="block text-sm font-medium text-[#003194] mb-2">
                  Nome Fantasia
                </label>
                <input
                  type="text"
                  id="tradeName"
                  name="tradeName"
                  placeholder="Ex: Grupo Hotelaria Brasil"
                  value={form.tradeName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.tradeName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.tradeName && <div style={{ color: "red", fontWeight: 500 }}>{errors.tradeName}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-[#003194] mb-2">
                  CNPJ
                </label>
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={form.cnpj}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.cnpj ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.cnpj && <div style={{ color: "red", fontWeight: 500 }}>{errors.cnpj}</div>}
              </div>
              <div>
                <label htmlFor="stateRegistration" className="block text-sm font-medium text-[#003194] mb-2">
                  Inscrição Estadual
                </label>
                <input
                  type="text"
                  id="stateRegistration"
                  name="stateRegistration"
                  placeholder="Inscrição na Receita Estadual"
                  value={form.stateRegistration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.stateRegistration ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.stateRegistration && <div style={{ color: "red", fontWeight: 500 }}>{errors.stateRegistration}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="phone1" className="block text-sm font-medium text-[#003194] mb-2">
                  Telefone 1
                </label>
                <input
                  type="tel"
                  id="phone1"
                  name="phone1"
                  placeholder="(11) 99999-9999"
                  value={form.phone1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.phone1 ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.phone1 && <div style={{ color: "red", fontWeight: 500 }}>{errors.phone1}</div>}
              </div>
              <div>
                <label htmlFor="phone2" className="block text-sm font-medium text-[#003194] mb-2">
                  Telefone 2 (opcional)
                </label>
                <input
                  type="tel"
                  id="phone2"
                  name="phone2"
                  placeholder="(11) 99999-9999"
                  value={form.phone2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.phone2 ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.phone2 && <div style={{ color: "red", fontWeight: 500 }}>{errors.phone2}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#003194] mb-2">
                  E-mail de acesso
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.email && <div style={{ color: "red", fontWeight: 500 }}>{errors.email}</div>}
              </div>
              <div>
                <label htmlFor="confirmEmail" className="block text-sm font-medium text-[#003194] mb-2">
                  Confirmar e-mail
                </label>
                <input
                  type="email"
                  id="confirmEmail"
                  name="confirmEmail"
                  placeholder="seu@email.com"
                  value={form.confirmEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.confirmEmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.confirmEmail && <div style={{ color: "red", fontWeight: 500 }}>{errors.confirmEmail}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#003194] mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.password && <div style={{ color: "red", fontWeight: 500 }}>{errors.password}</div>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#003194] mb-2">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Repita a senha"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.confirmPassword && <div style={{ color: "red", fontWeight: 500 }}>{errors.confirmPassword}</div>}
              </div>
            </div>

            {/* Dados da hospedagem */}
            <div className="pt-6 border-t border-gray-200 mb-8">
              <h3 className="text-xl text-[#003194] mb-6">Endereço</h3>

              {/* CEP em div separada */}
              <div className="mb-4">
                <label htmlFor="zipCode" className="block text-sm font-medium text-[#003194] mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder="00000-000"
                  value={form.zipCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.zipCode && <div style={{ color: "red", fontWeight: 500 }}>{errors.zipCode}</div>}
              </div>

              {/* Rua e Número na mesma div */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/2">
                    <label htmlFor="street" className="block text-sm font-medium text-[#003194] mb-2">
                      Rua
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      placeholder="Rua"
                      value={form.street}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border ${errors.street ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                    />
                    {errors.street && <div style={{ color: "red", fontWeight: 500 }}>{errors.street}</div>}
                  </div>
                  <div className="w-full md:w-1/2">
                    <label htmlFor="addressNumber" className="block text-sm font-medium text-[#003194] mb-2">
                      Número
                    </label>
                    <input
                      type="text"
                      id="addressNumber"
                      name="addressNumber"
                      placeholder="Número"
                      value={form.addressNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border ${errors.addressNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                    />
                    {errors.addressNumber && <div style={{ color: "red", fontWeight: 500 }}>{errors.addressNumber}</div>}
                  </div>
                </div>
              </div>

              {/* Bairro e Cidade na mesma div */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/2">
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-[#003194] mb-2">
                      Bairro
                    </label>
                    <input
                      type="text"
                      id="neighborhood"
                      name="neighborhood"
                      placeholder="Bairro"
                      value={form.neighborhood}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border ${errors.neighborhood ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                    />
                    {errors.neighborhood && <div style={{ color: "red", fontWeight: 500 }}>{errors.neighborhood}</div>}
                  </div>
                  <div className="w-full md:w-1/2">
                    <label htmlFor="city" className="block text-sm font-medium text-[#003194] mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Cidade"
                      value={form.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                    />
                    {errors.city && <div style={{ color: "red", fontWeight: 500 }}>{errors.city}</div>}
                  </div>
                </div>
              </div>

              {/* Estado e País na mesma div */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/2">
                    <label htmlFor="state" className="block text-sm font-medium text-[#003194] mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="Estado"
                      value={form.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                    />
                    {errors.state && <div style={{ color: "red", fontWeight: 500 }}>{errors.state}</div>}
                  </div>
                  <div className="w-full md:w-1/2">
                    <label htmlFor="country" className="block text-sm font-medium text-[#003194] mb-2">
                      País
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      placeholder="País"
                      value={form.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                    />
                    {errors.country && <div style={{ color: "red", fontWeight: 500 }}>{errors.country}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Termos e Condições */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3 mb-6 gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-[#003194] focus:ring-[#003194] border-gray-300 rounded"
                />

                <label htmlFor="terms" className="text-lg text-[#003194] leading-relaxed">
                  Autorizo a Viagium e suas entidades relacionadas a utilizar os meus dados e/ou os de titular para obter informações financeiras comerciais, de crédito e realizar consultas sobre bases de dados necessárias aos serviços solicitados, conforme <a href="/privacy-policy" className="font-bold no-underline hover:text-orange-500" target="_blank">Política de Privacidade da Viagium</a>.
                </label>
              </div>

              {errors.terms && <div style={{ color: "red", fontWeight: 500 }}>{errors.terms}</div>}
            </div>

            {/* Botão de Submit */}
            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                className="w-full max-w-md bg-[#003194] text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-[#002a7a] transition-colors duration-200"
              >
                REGISTRE-SE
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />

    </div>
  )
}

export default AffiliatePage;