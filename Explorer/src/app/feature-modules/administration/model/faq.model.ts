export interface FAQDto {
    id: number,
    question: string;
    answer: string;
    createdDate: string;
    lastUpdatedDate?: string;
  }