
export interface RatingApplication {
    id?: number;
    grade: number;
    comment: string;
    ratingTime: Date;
    userId?: number;
}


export interface Image {
    data: string;
    uploadedAt: Date;
    mimeType: number; 
}

export interface Person {
    id: number;
    name: string;
    lastName: string;
    username: string;
    profileImage: Image | null;
}

export interface RatingWithUser{
    ratingApplication: RatingApplication;
    account: Person;
}