export type Address = {
    country: string;
    city: string;
};

export type Schedule = {
    startDate: Date;
    isFixed: boolean;
    isAvailable: boolean;
    salesLeft: number;
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
    qtySold: number;
    originAddress: Address;
    destinationAddress: Address;
    isActive: boolean;
    schedules: Schedule[];
};
