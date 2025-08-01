export type Address = {
    country: string;
    city: string;
};

export type Schedule = {
    startDate: string;
    endDate: string;
    duration: number;
    isFixed: boolean;
    isAvailable: boolean;
};

export type TravelPackage = {
    id: number;
    title: string;
    description: string;
    vehicleType: string;
    price: number;
    originalPrice: number;
    packageTax: number;
    duration: number;
    image: string;
    rating: number;
    reviews: number;
    maxPeople: number;
    originAddress: Address;
    destinationAddress: Address;
    isActive: boolean;
    schedules: Schedule[];
    cupomDiscount?: string;
    discountValue?: number;
    manualDiscountValue?: number;
};