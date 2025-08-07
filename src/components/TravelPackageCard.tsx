import Badge from "./Badge";
import type { TravelPackage } from "../types/travelPackageTypes";
import { LuCalendarDays } from "react-icons/lu";
import { Link } from "react-router-dom";

type TravelPackageCardProps = {
    pkg: TravelPackage;
};

const TravelPackageCard = ({ pkg }: TravelPackageCardProps) => {

    return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="relative overflow-hidden">
            <img
                src={pkg.image || "/placeholder.svg"}
                alt={pkg.destinationCity}
                width={400}
                height={300}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {pkg.maxPeople - pkg.confirmedPeople < 10 && (
                <div className="absolute bottom-3 left-3">
                    <Badge variant="red">
                        Restam apenas {pkg.maxPeople - pkg.confirmedPeople} vagas! 🔥
                    </Badge>
                </div>
            )}

        </div>
        <div className="flex flex-col justify-between p-4 gap-4">
            <div className="flex items-center gap-4">

                    <h3 className="text-[10px] text-gray-900">{`${pkg.originCity}, ${pkg.originCountry}`}</h3>
                    <h3 className="font-bold text-gray-900">{`→`}</h3>
                    <h3 className="font-bold text-[10px] text-gray-900">{`${pkg.destinationCity}, ${pkg.destinationCountry}`}</h3>

            </div>
            <h4 className="text-lg font-bold text-blue-600">{pkg.title}</h4>
            <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-500 gap-1">
                    <span className="inline-block"><LuCalendarDays /></span>
                    <span className="text-sm">{pkg.duration} dias</span>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-900">{pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>

                    {pkg.originalPrice > pkg.price && pkg.originalPrice > 0 && (
                        <span className="text-sm text-gray-500 line-through">{pkg.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    )}
                </div>
                <Link to={`/package/${pkg.id}`} className="inline-block">
                    <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                        Ver pacote
                    </button>
                </Link>
            </div>
        </div>
    </div>
)};

export default TravelPackageCard;