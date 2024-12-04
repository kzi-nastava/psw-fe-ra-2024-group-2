import { Chapter } from './chapter.model';
export class PersonalDairy {
  id: number; 
  userId: number; 
  tourId: number;
  title: string;
  createdAt: Date;
  status: DairyStatus;
  chapters: Chapter[];

}

export enum DairyStatus {
  InProgress = 0, // ili vrednosti koje backend koristi
  Completed = 1
}
