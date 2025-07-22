export class TourIssueNotification {
    constructor(
        public fromUserId: number,
        public toUserId: number,
        public status: TourIssueNotificationStatus,
        public tourIssueReportId: number,
        public fromUsername?: string,
        public toUsername?: string  
    ) { }
}

export enum TourIssueNotificationStatus {
    Pending = 'Pending',
    Resolved = 'Resolved',
    Unresolved = 'Unresolved',
}