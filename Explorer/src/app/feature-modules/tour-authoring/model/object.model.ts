import { Image } from "../../../shared/model/image.model";

export enum ObjectCategory {
    WC = "WC",
    Restaurant = "Restaurant",
    Parking = "Parking"
  }
  
  
  export interface Object {
    name: string;
    description: string;
    image: Image | null; 
    category: ObjectCategory; 
    longitude: number;
    latitude: number;
  }