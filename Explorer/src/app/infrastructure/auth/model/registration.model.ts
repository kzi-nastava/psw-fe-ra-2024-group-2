export interface Registration {
    name: string;
    surname: string;
    email: string;
    username: string;
    password: string;
    interests: string; // Adding interests
}

export enum TourCategory {
    Nature,
    Art,
    Sports,
    Shopping,
    Food
}
