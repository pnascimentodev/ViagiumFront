import Badge from "./Badge";
import type { TravelPackage } from "../types/travelPackageTypes";
import { LuCalendarDays } from "react-icons/lu";
import { Link } from "react-router-dom";

type TravelPackageCardProps = {
    pkg: TravelPackage;
};

const getNextSchedule = (pkg: TravelPackage) => {
    if (!pkg.schedules || pkg.schedules.length === 0) return null;
    const now = new Date();
    return pkg.schedules
        .filter(s => new Date(s.startDate) > now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0] || null;
};

const TravelPackageCard = ({ pkg }: TravelPackageCardProps) => {
    const nextSchedule = getNextSchedule(pkg);

    return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="relative overflow-hidden">
            <img
                src={pkg.image || "/placeholder.svg"}
                alt={pkg.destinationAddress.city}
                width={400}
                height={300}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {nextSchedule && !nextSchedule.isAvailable && (
                <div className="absolute bottom-3 left-3">
                    <Badge variant="red">
                        Últimas vagas disponíveis! 🔥
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
                <div className="flex items-center space-x-1 text-gray-500 gap-1">
                    <span className="inline-block"><LuCalendarDays /></span>
                    <span className="text-sm">{pkg.duration} dias</span>
                </div>
                <span className="text-xs text-gray-500">{pkg.reviews} reviews</span>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-xl font-bold text-gray-900">{pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">{pkg.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <Link to={`/package/${pkg.id}`} className="inline-block">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                        Ver pacote
                    </button>
                </Link>
            </div>
        </div>
    </div>
)};

export default TravelPackageCard;
