import { DatePipe } from "@angular/common";

export interface RatingApplication {
    id?: number;
    grade: number;
    comment: string;
    ratingTime: Date;
    userId?: number;
}