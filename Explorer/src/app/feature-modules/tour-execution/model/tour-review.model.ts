import { Image } from "../../../shared/model/image.model";

export interface TourReview {
    id?: number;
    grade: number;
    comment: string;
    userId?: number;
    tourId?: number;
    reviewDate: Date 
    visitDate: Date
    image: Image | null;
}