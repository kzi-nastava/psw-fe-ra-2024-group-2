
export interface RatingApplication {
    id?: number;
    grade: number;
    comment: string;
    ratingTime: Date;
    userId?: number;
}

export interface RatingWithUser{
    ratingApplication: RatingApplication;
    username: string;
}