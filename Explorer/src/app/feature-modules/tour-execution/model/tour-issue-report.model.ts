export interface TourIssueReport {
    id: number,
    category: string,
    description: string,
    priority: string,
    createdAt: string,
    fixUntil: string,
    status: number,
    userId: number,
    tourId: number
}