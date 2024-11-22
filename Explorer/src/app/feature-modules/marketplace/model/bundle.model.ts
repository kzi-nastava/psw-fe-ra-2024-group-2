export enum BundleStatus {
    Draft = 0,
    Published = 1,
    Archived = 2
}

export enum TourStatus {
    Draft = 0,
    Published = 1,
    Archived = 2
}

export interface TourWithPrice {
    tourId: number;
    price: number;
    tourStatus: TourStatus;
}

export interface Bundle {
    name: string;
    price: number;
    tours: TourWithPrice[];
    authorId: string | null;
    status: BundleStatus | null;
}