import { Tour } from "./tour-model";

export interface TourExecution {
    id: number;
    userId: number;
    tourId: number;
    status: number;
    sessionEndingTime: Date;
    lastActivity: Date;
    tourExecutionCheckpoints: any[];
  }