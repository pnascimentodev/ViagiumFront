// Validação de CPF (com dígito verificador)
export function validateCPF(cpf: string): boolean {
    const v = cpf.replace(/\D/g, "");
    if (v.length !== 11 || /^([0-9])\1+$/.test(v)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(v.charAt(i)) * (10 - i);
    let firstCheck = (sum * 10) % 11;
    if (firstCheck === 10 || firstCheck === 11) firstCheck = 0;
    if (firstCheck !== parseInt(v.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(v.charAt(i)) * (11 - i);
    let secondCheck = (sum * 10) % 11;
    if (secondCheck === 10 || secondCheck === 11) secondCheck = 0;
    if (secondCheck !== parseInt(v.charAt(10))) return false;
    return true;
}

// Validação de Passaporte (mínimo 6 caracteres, pode ser letras e números)
export function validatePassaporte(passaporte: string): boolean {
    return !!passaporte && passaporte.length >= 6;
}
// Validação de e-mail (gmail, outlook, yahoo)
export function validateEmail(email: string): boolean {
    return /^[\w.-]+@(?:gmail|outlook|yahoo)\.com$/i.test(email);
}

// Validação de senha forte
export function validatePassword(password: string): string | null {
    if (password.length < 8) {
        return "A senha deve ter pelo menos 8 caracteres.";
    }
    if (!/[A-Z]/.test(password)) {
        return "A senha deve conter pelo menos uma letra maiúscula.";
    }
    if (!/\d/.test(password)) {
        return "A senha deve conter pelo menos um número.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "A senha deve conter pelo menos um símbolo.";
    }
    return null;
}

// Validação de telefone brasileiro
export function validatePhone(phone: string): boolean {
    return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone);
}

// Validação de telefone brasileiro sem máscara (apenas números)
export function validatePhoneUnmasked(phone: string): boolean {
    const phoneNumbers = phone.replace(/\D/g, '');
    return phoneNumbers.length >= 10 && phoneNumbers.length <= 11;
}

// Validação de CEP brasileiro
export function validateCEP(cep: string): boolean {
    return /^\d{5}-\d{3}$/.test(cep);
}

// Validação de CNPJ
export function validateCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/\D/g, "");
    if (cnpj.length !== 14) return false;
    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1+$/.test(cnpj)) return false;
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    return true;
}

// Validação de campos obrigatórios
export function validateRequired(value: string): boolean {
    return value.trim() !== "";
}

// Validação de confirmação de e-mail
export function validateEmailConfirmation(email: string, confirmEmail: string): string | null {
    if (!validateEmail(email)) return "E-mail inválido.";
    if (email !== confirmEmail) return "Os e-mails não coincidem.";
    return null;
}

// Validação de confirmação de senha
export function validatePasswordConfirmation(password: string, confirmPassword: string): string | null {
    if (password !== confirmPassword) return "As senhas não coincidem.";
    return null;
}

// Validação de número Cadastur (apenas números)
export function validateCadasturNumber(num: string): boolean {
    return /^\d+$/.test(num);
}

// Validação de data futura (data de expiração)
export function validateFutureDate(dateStr: string): boolean {
    const today = new Date();
    const inputDate = new Date(dateStr);
    // Zera horas para comparar apenas datas
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today;
}

// Validação de aceite dos termos
export function validateTerms(checked: boolean): boolean {
    return checked;
}

// Validação de data de chegada
export function validateArrivalAfterDeparture(departure: string, arrival: string): boolean {
    if (!departure || !arrival) return true;
    return new Date(arrival) >= new Date(departure);
}