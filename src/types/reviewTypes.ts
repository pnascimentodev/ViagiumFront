export interface Reservation {
  id: number;
  userId: number;
  travelPackageId: number;
  startDate: string;
  endDate?: string;
  totalPrice: number;
  status: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  travelPackage?: {
    id: number;
    packageName: string;
    description: string;
    price: number;
    duration: number;
    destinationAddress: {
      city: string;
      state?: string;
      country: string;
    };
    originAddress?: {
      city: string;
      state?: string;
      country: string;
    };
    imageUrl?: string;
  };
  hotel?: {
    id: number;
    name: string;
    star: number;
    city: string;
  };
  roomType?: {
    id: number;
    name: string;
    capacity: number;
  };
  reservationId: number;
};

export interface ReviewRequest {
  reservationId: number;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  reservationId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}
