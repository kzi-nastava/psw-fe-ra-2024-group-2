import { TouristPosition } from "./tourist-position";

export interface Person{
    id: number;
    userId: number;
    name: string;
    surname: string;
    email: string;
    touristPosition: TouristPosition;
}