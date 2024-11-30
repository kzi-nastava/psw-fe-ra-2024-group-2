import { Image } from 'src/app/shared/model/image.model';
export interface EncounterDto {
    id: number;             // Encounter ID
    name: string;           // Encounter Name
    description: string;    // Encounter Description
    lattitude: number;      // Latitude of the encounter location
    longitude: number;      // Longitude of the encounter location
}

// SocialEncounterDto extends EncounterDto
export interface SocialEncounterDto extends EncounterDto {
    requiredPeople: number;   // Number of people required for the encounter
    rangeInMeters: number;    // Range of the encounter in meters
}

// HiddenLocationEncounterDto extends EncounterDto and includes Image
export interface HiddenLocationEncounterDto extends EncounterDto {
    image: Image;              // Image associated with the encounter
    targetLatitude: number;    // Latitude of the hidden location
    targetLongitude: number;   // Longitude of the hidden location
    rangeInMeters: number;     // Range of the encounter in meters
}

// MiscEncounterDto extends EncounterDto
export interface MiscEncounterDto extends EncounterDto {
    actionDescription: string; // Description of the action for this encounter
}