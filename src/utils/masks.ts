// Máscara para CPF: 000.000.000-00
export function maskCPF(value: string) {
    const onlyNumbers = value.replace(/\D/g, "");
    const v = onlyNumbers.slice(0, 11);
    if (v.length > 9) {
        return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
    } else if (v.length > 6) {
        return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    } else if (v.length > 3) {
        return `${v.slice(0, 3)}.${v.slice(3)}`;
    }
    return v;
}

export function unmaskCPF(maskedCPF: string): string {
    return maskedCPF.replace(/\D/g, "");
}

// Máscara para Passaporte: retorna tudo em maiúsculo, permite letras e números
export function maskPassaporte(value: string) {
    return value.toUpperCase();
}
// Função para aplicar máscara de telefone (99) 99999-9999
export function maskPhone(value: string) {
    let v = value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
        return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
        return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
        return `(${v}`;
    }
    return "";
}

// Máscara para CEP: 00000-000
export function maskCEP(value: string) {
    let v = value.replace(/\D/g, "");
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length > 5) {
        return `${v.slice(0, 5)}-${v.slice(5)}`;
    }
    return v;
}

// Máscara para CNPJ: 00.000.000/0000-00
export function maskCNPJ(value: string) {
    let v = value.replace(/\D/g, "");
    if (v.length > 14) v = v.slice(0, 14);
    if (v.length > 12) {
        return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12)}`;
    } else if (v.length > 8) {
        return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8)}`;
    } else if (v.length > 5) {
        return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5)}`;
    } else if (v.length > 2) {
        return `${v.slice(0, 2)}.${v.slice(2)}`;
    }
    return v;
}

// Máscara para Inscrição Estadual (padrão: números, pode variar por estado)
export function maskInscricaoEstadual(value: string) {
    // Apenas números, máximo 12 dígitos (ajuste conforme necessário)
    let v = value.replace(/\D/g, "");
    if (v.length > 12) v = v.slice(0, 12);
    return v;
}

// Máscara para número Cadastur (apenas números, até 11 dígitos)
export function maskCadasturNumber(value: string) {
    let v = value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    return v;
}

// Máscara para valores em Real (BRL): R$ 0.000,00
export function maskCurrency(value: string) {
    // Remove tudo que não é número
    let v = value.replace(/\D/g, "");
    
    // Se não há números, retorna vazio
    if (!v) return "";
    
    // Limita a valores até R$ 999.999,99 (remove se muito grande)
    if (parseInt(v) > 99999999) v = v.slice(0, 8);
    
    // Converte para número e divide por 100 para ter centavos
    const number = parseInt(v) / 100;
    
    // Formata como moeda brasileira
    return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
}

// Função auxiliar para extrair valor numérico da máscara
export function unmaskCurrency(maskedValue: string): string {
    // Remove R$, espaços, pontos de milhares e substitui vírgula por ponto
    if (!maskedValue) return "";

    let numericString = maskedValue
        .replace(/[R$\s]/g, '')
        .replace(/\./g, '')

    numericString = numericString.replace(',', '.');
    
    return numericString;
}
export function maskCardNumber(value: string){
    let v = value.replace(/\D/g, "");
    if (v.length > 12) {
        return `${v.slice(0, 4)} ${v.slice(4, 8)} ${v.slice(8, 12)} ${v.slice(12)}`;
    } else if (v.length > 8) {
        return `${v.slice(0, 4)} ${v.slice(4, 8)} ${v.slice(8)}`;
    } else if (v.length > 4) {
        return `${v.slice(0, 4)} ${v.slice(4)}`;
    }
    return v;
}

export function maskValidateExpirationDate(value: string) {
    // Aceita apenas MM/YY
    let v = value.replace(/\D/g, "");
    if (v.length > 4) v = v.slice(0, 4);
    if (v.length > 2) {
        return `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    return v;
}