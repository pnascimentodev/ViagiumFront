import { useState } from "react";
import { validateEmail, validatePassword, validatePhone, validateCEP, validateCNPJ, validateRequired, validateEmailConfirmation, validatePasswordConfirmation, validateCadasturNumber, validateFutureDate, validateTerms } from "../../../utils/validations.ts";
import { maskPhone, maskCEP, maskCNPJ, maskInscricaoEstadual, maskCadasturNumber, maskCPF, maskPassaporte } from "../../../utils/masks.ts";
import { validateCPF, validatePassaporte } from "../../../utils/validations.ts";



function ModalHotel() {
      // Form state
      const [form, setForm] = useState({
        RazaoSocial: "",
        NomeFantasia: "",
        telefone1: "",
        telefone2: "",
        email: "",
        confirmarEmail: "",
        senha: "",
        confirmarSenha: "",
        cpfPassaporte: "",
        nomeHospedagem: "",
        tipo: "",
        cep: "",
        rua: "",
        bairro: "",
        estado: "",
        pais: "",
        nomeEmpresa: "",
        cnpj: "",
        inscricaoEstadual: "",
        numeroCadastur: "",
        dataExpiracao: "",
        termos: false,
      });
      const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
      function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        let newValue = value;
        switch (name) {
          case "telefone1":
          case "telefone2":
            newValue = maskPhone(value);
            break;
          case "cep":
            newValue = maskCEP(value);
            break;
          case "cnpj":
            newValue = maskCNPJ(value);
            break;
          case "inscricaoEstadual":
            newValue = maskInscricaoEstadual(value);
            break;
          case "numeroCadastur":
            newValue = maskCadasturNumber(value);
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
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : newValue }));
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
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
          case "confirmarEmail":
            error = validateEmailConfirmation(form.email, value) || "";
            break;
          case "senha":
            error = validatePassword(value) || "";
            break;
          case "confirmarSenha":
            error = validatePasswordConfirmation(form.senha, value) || "";
            break;
          case "telefone1":
            if (!validatePhone(value)) error = "Telefone inválido.";
            break;
          case "cep":
            if (!validateCEP(value)) error = "CEP inválido.";
            break;
          case "cnpj":
            if (!validateCNPJ(value)) error = "CNPJ inválido.";
            break;
          case "numeroCadastur":
            if (!validateCadasturNumber(value)) error = "Apenas números.";
            break;
          case "dataExpiracao":
            if (value && !validateFutureDate(value)) error = "Data inválida.";
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
        if (!validateRequired(form.RazaoSocial)) newErrors.RazaoSocial = "Campo obrigatório.";
        if (!validateRequired(form.NomeFantasia)) newErrors.NomeFantasia = "Campo obrigatório.";
        if (!validatePhone(form.telefone1)) newErrors.telefone1 = "Telefone inválido.";
        if (form.telefone2 && !validatePhone(form.telefone2)) newErrors.telefone2 = "Telefone inválido.";
        if (!validateEmail(form.email)) newErrors.email = "Digite um e-mail válido.";
        const emailConf = validateEmailConfirmation(form.email, form.confirmarEmail);
        if (emailConf) newErrors.confirmarEmail = emailConf;
        const senhaVal = validatePassword(form.senha);
        if (senhaVal) newErrors.senha = senhaVal;
        const senhaConf = validatePasswordConfirmation(form.senha, form.confirmarSenha);
        if (senhaConf) newErrors.confirmarSenha = senhaConf;
        if (!validateRequired(form.nomeHospedagem)) newErrors.nomeHospedagem = "Campo obrigatório.";
        if (!validateRequired(form.tipo)) newErrors.tipo = "Campo obrigatório.";
        if (!validateCEP(form.cep)) newErrors.cep = "CEP inválido.";
        if (!validateRequired(form.rua)) newErrors.rua = "Campo obrigatório.";
        if (!validateRequired(form.bairro)) newErrors.bairro = "Campo obrigatório.";
        if (!validateRequired(form.estado)) newErrors.estado = "Campo obrigatório.";
        if (!validateRequired(form.pais)) newErrors.pais = "Campo obrigatório.";
        if (!validateRequired(form.nomeEmpresa)) newErrors.nomeEmpresa = "Campo obrigatório.";
        if (!validateCNPJ(form.cnpj)) newErrors.cnpj = "CNPJ inválido.";
        if (!validateRequired(form.inscricaoEstadual)) newErrors.inscricaoEstadual = "Campo obrigatório.";
        if (!validateCadasturNumber(form.numeroCadastur)) newErrors.numeroCadastur = "Apenas números.";
        if (!validateFutureDate(form.dataExpiracao)) newErrors.dataExpiracao = "Data inválida.";
        if (!validateTerms(form.termos)) newErrors.termos = "Você deve aceitar os termos.";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        alert("Cadastro realizado com sucesso!");
        // Aqui você pode enviar os dados para a API
      }

    return (
      <div className="w-full max-w-6xl mx-auto p-6 mt-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Dados da hospedagem */}
            <div className="pt-6">
              <h3 className="text-2xl font-semibold text-[#003194] mb-6">Dados do Hotel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="nomeHospedagem" className="block text-sm font-medium text-[#003194] mb-2">
                    Nome da hospedagem
                  </label>
                  <input
                    type="text"
                    id="nomeHospedagem"
                    name="nomeHospedagem"
                    placeholder="Insira o nome da hospedagem"
                    value={form.nomeHospedagem}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${errors.nomeHospedagem ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                  />
                  {errors.nomeHospedagem && <div style={{ color: "red", fontWeight: 500 }}>{errors.nomeHospedagem}</div>}
                </div>
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-[#003194] mb-2">
                    Tipo
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${errors.tipo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                  >
                    {errors.tipo && <div style={{ color: "red", fontWeight: 500 }}>{errors.tipo}</div>}
                    <option value="">Selecione o tipo de hospedagem</option>
                    <option value="hotel">Hotel</option>
                    <option value="pousada">Pousada</option>
                    <option value="resort">Resort</option>
                    <option value="hostel">Hostel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-[#003194] mb-2">
                    CEP
                  </label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    placeholder="00000-000"
                    value={form.cep}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${errors.cep ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                  />
                  {errors.cep && <div style={{ color: "red", fontWeight: 500 }}>{errors.cep}</div>}
                </div>
                <div>
                  <label htmlFor="rua" className="block text-sm font-medium text-[#003194] mb-2">
                    Rua
                  </label>
                  <input
                    type="text"
                    id="rua"
                    name="rua"
                    placeholder="Rua"
                    value={form.rua}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${errors.rua ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                  />
                  {errors.rua && <div style={{ color: "red", fontWeight: 500 }}>{errors.rua}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-[#003194] mb-2">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="bairro"
                    name="bairro"
                    placeholder="Bairro"
                    value={form.bairro}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${errors.bairro ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                  />
                  {errors.bairro && <div style={{ color: "red", fontWeight: 500 }}>{errors.bairro}</div>}
                </div>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-[#003194] mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    placeholder="Estado"
                    value={form.estado}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${errors.estado ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                  />
                  {errors.estado && <div style={{ color: "red", fontWeight: 500 }}>{errors.estado}</div>}
                </div>
                <div>
                  <label htmlFor="pais" className="block text-sm font-medium text-[#003194] mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    id="pais"
                    name="pais"
                    placeholder="País"
                    value={form.pais}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${errors.pais ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                  />
                  {errors.pais && <div style={{ color: "red", fontWeight: 500 }}>{errors.pais}</div>}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-[#003194] mb-2">
                  Nome da empresa
                </label>
                <input
                  type="text"
                  id="nomeEmpresa"
                  name="nomeEmpresa"
                  placeholder="Ex: Hotel Fazenda S.A ou João Pedro"
                  value={form.nomeEmpresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border ${errors.nomeEmpresa ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                />
                {errors.nomeEmpresa && <div style={{ color: "red", fontWeight: 500 }}>{errors.nomeEmpresa}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                  <label htmlFor="inscricaoEstadual" className="block text-sm font-medium text-[#003194] mb-2">
                    Inscrição Estadual
                  </label>
                  <input
                    type="text"
                    id="inscricaoEstadual"
                    name="inscricaoEstadual"
                    placeholder="Inscrição na Receita Estadual"
                    value={form.inscricaoEstadual}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${errors.inscricaoEstadual ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                  />
                  {errors.inscricaoEstadual && <div style={{ color: "red", fontWeight: 500 }}>{errors.inscricaoEstadual}</div>}
                </div>
              </div>
            </div>

            {/* Cadastur */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-[#003194] mb-6">Cadastur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="numeroCadastur" className="block text-sm font-medium text-[#003194] mb-2">
                    Insira o número
                  </label>
                  <input
                    type="text"
                    id="numeroCadastur"
                    name="numeroCadastur"
                    placeholder="Ex: 1234"
                    value={form.numeroCadastur}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${errors.numeroCadastur ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                  />
                  {errors.numeroCadastur && <div style={{ color: "red", fontWeight: 500 }}>{errors.numeroCadastur}</div>}
                </div>
                <div>
                  <label htmlFor="dataExpiracao" className="block text-sm font-medium text-[#003194] mb-2">
                    Data de Expiração
                  </label>
                  <input
                    type="date"
                    id="dataExpiracao"
                    name="dataExpiracao"
                    value={form.dataExpiracao}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border ${errors.dataExpiracao ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#003194] focus:border-transparent`}
                  />
                  {errors.dataExpiracao && <div style={{ color: "red", fontWeight: 500 }}>{errors.dataExpiracao}</div>}
                </div>
              </div>
            </div>

            {/* Termos e Condições */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3 mb-6 gap-2">
                <input
                  type="checkbox"
                  id="termos"
                  name="termos"
                  checked={form.termos}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-[#003194] focus:ring-[#003194] border-gray-300 rounded"
                />

                <label htmlFor="termos" className="text-lg text-[#003194] leading-relaxed">
                  Autorizo a Viagium e suas entidades relacionadas a utilizar os meus dados e/ou os de titular para obter informações financeiras comerciais, de crédito e realizar consultas sobre bases de dados necessárias aos serviços solicitados, conforme <a href="#" className="font-bold no-underline hover:text-orange-500" target="_blank">Política de Privacidade da Viagium</a>.
                </label>
              </div>

              {errors.termos && <div style={{ color: "red", fontWeight: 500 }}>{errors.termos}</div>}
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
    )
};

export default ModalHotel;