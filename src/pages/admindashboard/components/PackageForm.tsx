import React from "react";

interface PackageFormData {
    title: string;
    description: string;
    originCity: string;
    originCountry: string;
    destinationCity: string;
    destinationCountry: string;
    image: File | null;
    duration: string;
    maxPeople: string;
    vehicleType: string;
    originalPrice: string;
    packageFee: string;
    discountCoupon: string;
    selectedHotels: number[];
    isActive: boolean;
}

interface PackageFormProps {
    formData: PackageFormData;
    setFormData: (data: PackageFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    formId: string;
    isEditing?: boolean;
}

const PackageForm: React.FC<PackageFormProps> = ({
    formData,
    setFormData,
    onSubmit,
    formId,
    isEditing = false
}) => {
    const vehicleTypes = ["Ônibus", "Avião"];

    const handleInputChange = (field: keyof PackageFormData, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <form id={formId} onSubmit={onSubmit} className="space-y-8">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Título do Pacote</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Descrição</label>
                <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descrição detalhada do pacote..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Cidade de Origem</label>
                    <input
                        type="text"
                        required
                        value={formData.originCity}
                        onChange={(e) => handleInputChange('originCity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: São Paulo"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">País de Origem</label>
                    <input
                        type="text"
                        required
                        value={formData.originCountry}
                        onChange={(e) => handleInputChange('originCountry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Brasil"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Cidade de Destino</label>
                    <input
                        type="text"
                        required
                        value={formData.destinationCity}
                        onChange={(e) => handleInputChange('destinationCity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Rio de Janeiro"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">País de Destino</label>
                    <input
                        type="text"
                        required
                        value={formData.destinationCountry}
                        onChange={(e) => handleInputChange('destinationCountry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Brasil"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Upload de Imagem</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange('image', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.image && (
                    <p className="mt-1 text-sm text-gray-500">Arquivo selecionado: {formData.image.name}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Duração</label>
                    <input
                        type="text"
                        required
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Máx. Pessoas</label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.maxPeople}
                        onChange={(e) => handleInputChange('maxPeople', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Veículo</label>
                    <select
                        required
                        value={formData.vehicleType}
                        onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecione o veículo</option>
                        {vehicleTypes.map((vehicle) => (
                            <option key={vehicle} value={vehicle}>
                                {vehicle}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Preço Original</label>
                    <input
                        type="text"
                        required
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: R$ 1.200,00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Taxa do Serviço</label>
                    <input
                        type="text"
                        value={formData.packageFee}
                        onChange={(e) => handleInputChange('packageFee', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: R$ 50,00"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Porcentagem do Cupom de Desconto (%)</label>
                    <select
                        value={formData.discountCoupon}
                        onChange={(e) => handleInputChange('discountCoupon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="0">Sem desconto</option>
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                        <option value="20">20%</option>
                        <option value="25">25%</option>
                        <option value="30">30%</option>
                        <option value="35">35%</option>
                        <option value="40">40%</option>
                        <option value="45">45%</option>
                        <option value="50">50%</option>
                    </select>
                </div>
                <div></div>
            </div>

            <div className="pt-4">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">Pacote Ativo</span>
                </label>
            </div>
        </form>
    );
};

export default PackageForm;
export type { PackageFormData };
