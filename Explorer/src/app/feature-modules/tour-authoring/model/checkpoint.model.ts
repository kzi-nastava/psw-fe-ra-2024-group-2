export interface Checkpoint{
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    description: string;
    tours?: number[]; //Array of tour ids
    imageId?: number
}