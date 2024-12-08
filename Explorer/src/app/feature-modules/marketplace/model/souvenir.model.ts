export enum SouvenirStatus {
    Draft = 0,
    Published = 1,
    Archived = 2
}

export interface PaymentImageDto {
    data: string;
    uploadedAt: string;
    mimeType: string;
}

export interface Souvenir {
    id: number | null;
    name: string;
    description: string;
    price: number;
    count: number;
    souvenirStatus: SouvenirStatus | null;
    tourId: number;
    imageDto: PaymentImageDto;
}