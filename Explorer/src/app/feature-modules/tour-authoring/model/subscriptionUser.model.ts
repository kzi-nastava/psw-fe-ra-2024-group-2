export enum EventCategory {
	Concert = "Concert",
	MusicFestival = "MusicFestival",
	FilmFestival = "FilmFestival",
	FootballMatch = "FootballMatch",
	BasketballMatch = "BasketballMatch"
}

export interface TouristSubscription {
	categories: EventCategory[];
	 
}