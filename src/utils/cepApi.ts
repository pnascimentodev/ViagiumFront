import axios from "axios";

export interface AddressData {
    cep: string;
    address_type: string;
    address_name: string;
    address: string;
    state: string;
    district: string;
    lat: string;
    lng: string;
    city: string;
    city_ibge: string;
    ddd: string;
}

/**
 * Busca dados de endereço pelo CEP usando a API awesomeapi.
 * @param cep CEP no formato apenas números (ex: "01001000")
 * @returns Dados do endereço ou lança erro se não encontrado
 */
export async function fetchAddressByCEP(cep: string): Promise<AddressData> {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
        throw new Error("CEP deve conter 8 dígitos.");
    }
    const url = `https://cep.awesomeapi.com.br/json/${cleanCep}`;
    const response = await axios.get(url);
    if (response.data && !response.data.message) {
        return response.data as AddressData;
    } else {
        throw new Error(response.data?.message || "CEP não encontrado.");
    }
}
