import { Image } from "../../../shared/model/image.model";

export enum ObjectCategory {
    WC = "WC",
    Restaurant = "Restaurant",
    Parking = "Parking"
  }
  
  // Define the Object interface
  export interface Object {
    name: string;
    description: string;
    image: Image | null; // Ensure Image type is defined or replace it with the appropriate type
    category: ObjectCategory; // Use the enum here
  }