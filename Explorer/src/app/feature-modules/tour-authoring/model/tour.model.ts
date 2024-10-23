import { Checkpoint } from "./checkpoint.model";

export interface Tour {
    id: number;
    userId: number;
    equipment: number[];  // Array of equipment IDs
    name: string;
    description: string;
    difficulty: number;
    tag: number;
    status: number;
    price: number;
    checkpoints: number[];  // List of checkpoints
}
