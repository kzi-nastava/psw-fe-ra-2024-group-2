import { Image } from "../../../shared/model/image.model";

export enum EventCategory {
    Concert = "Concert",
    MusicFestival = "MusicFestival",
    FilmFestival = "FilmFestival",
    FootballMatch = "FootballMatch",
    BasketballMatch = "BasketballMatch"
  }
  
  
  export interface EventModel {
    id: number,
    name: string;
    description: string;
    image: Image | null; 
    category: EventCategory; 
    longitude: number;
    latitude: number;
    startDate: Date;
    endDate: Date;
  }