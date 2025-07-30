import Badge from "./Badge";

export type Address = {
    country: string;
    city: string;
};

export type TravelPackage = {
    id: number;
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    duration: number;
    image: string;
    rating: number;
    reviews: number;
    qtySalesLimit: number;
    qtySold: number;
    originAddress: Address;
    destinationAddress: Address;
};

type TravelPackageCardProps = {
    pkg: TravelPackage;
};

const TravelPackageCard = ({ pkg }: TravelPackageCardProps) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="relative overflow-hidden">
            <img
                src={pkg.image || "/placeholder.svg"}
                alt={pkg.destinationAddress.city}
                width={400}
                height={300}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {pkg.qtySalesLimit && pkg.qtySalesLimit - pkg.qtySold <= 10 && (
                <div className="absolute bottom-3 left-3">
                    <Badge variant="red">
                        Faltam {pkg.qtySalesLimit - pkg.qtySold} vagas 🔥
                    </Badge>
                </div>
            )}

        </div>
        <div className="flex flex-col justify-between p-4 gap-2">
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-4 mr-8">
                    <h3 className="text-[10px] text-gray-900">{`${pkg.originAddress.city}, ${pkg.originAddress.country}`}</h3>
                    <h3 className="font-bold text-gray-900">{`→`}</h3>
                    <h3 className="font-bold text-[10px] text-gray-900">{`${pkg.destinationAddress.city}, ${pkg.destinationAddress.country}`}</h3>
                </div>
                <div className="flex items-center space-x-1">
                    <span className="inline-block text-yellow-400">⭐</span>
                    <span className="text-sm text-gray-600">{pkg.rating}</span>
                </div>
            </div>
            <h4 className="text-lg font-bold text-blue-600 ">{pkg.title}</h4>
            <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-500">
                    <span className="inline-block">🕒</span>
                    <span className="text-sm">{pkg.duration} dias</span>
                </div>
                <span className="text-xs text-gray-500">{pkg.reviews} reviews</span>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-xl font-bold text-gray-900">{pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">{pkg.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <a href={`/package/${pkg.id}`} className="inline-block">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                        Ver pacote
                    </button>
                </a>
            </div>
        </div>
    </div>
);

export default TravelPackageCard;
