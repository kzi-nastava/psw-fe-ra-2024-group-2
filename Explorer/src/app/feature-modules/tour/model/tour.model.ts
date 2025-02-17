import { KeyPoint } from "./keyPoint.model";

export interface Tour {
    id?: number;
    name: string;
    description: string;
    difficulty: number;
    category: string;
    price: number;
    date: Date;        
    guideId?: number; 
    keyPoints?: KeyPoint[];
    status?: string;   
}
