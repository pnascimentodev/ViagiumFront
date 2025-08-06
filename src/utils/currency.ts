export function formatBRL(value: number | string): string {
    // Se vier como string, tenta converter para número
    let num = typeof value === "string" ? Number(value) : value;
    if (isNaN(num)) return "R$ 0,00";
    // Usa toLocaleString para formatar como moeda brasileira
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}