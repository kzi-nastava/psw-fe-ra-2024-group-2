import { Tour } from "./tour-model";

export interface TourExecution {
    id: number;
    userId: number;
    tourId: number;
    tour: Tour;
    status: number;
    sessionEndingTime: Date;
    lastActivity: Date;
  }