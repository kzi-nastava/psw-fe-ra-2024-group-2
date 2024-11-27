export enum EventCategory {
	Concert = "Concert",
	MusicFestival = "MusicFestival",
	FilmFestival = "FilmFestival",
	FootballMatch = "FootballMatch",
	BasketballMatch = "BasketballMatch"
}

export interface EventSubscription {
	categories: EventCategory[];
	 
}