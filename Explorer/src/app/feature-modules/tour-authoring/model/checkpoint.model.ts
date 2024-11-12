import { Image } from "../../../shared/model/image.model";

export interface Checkpoint{
    id?: number;
    latitude: number;
    longitude: number;
    name: string;
    description: string;
    image?: Image | null;
    tours?: number[]; //Array of tour ids
    secret : string;
}