export interface Coupon {
    code: string;
    tourId: number;
    authorId: number;
    discountPercentage: number; 
    allToursDiscount: boolean;
}