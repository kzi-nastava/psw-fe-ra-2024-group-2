export interface TourSale {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    userId: number;
    discountPercentage: number;
    tours: TourPayment[];
  }
  

export interface TourPayment {
    id: number;
    userId: number;
    equipment: number[];
    name: string;
    description: string;
    difficulty: number;
    tag: number;
    status: number;
    price: number;
    checkpoints: number[];
    prices: TourPrice[];
    selected?: boolean;
  }

  export interface TourPrice {
    tourId: number;
    oldPrice: number;
    newPrice: number;
  }