import { Tour } from "./tour.model";

export interface Basket {
    touristId: number;
    tours?: Tour[];
}