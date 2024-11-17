import { Image } from "../../../shared/model/image.model";

export interface Profile {
    id : number;
    username: string;
    name: string;
    lastName: string;
    email: string;
    biography: string | null;
    moto: string | null;
    image: Image | null;
}