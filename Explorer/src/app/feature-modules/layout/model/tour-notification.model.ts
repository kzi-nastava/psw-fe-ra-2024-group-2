export class TourIssueNotification {
    constructor(
        public fromUserId: number,
        public toUserId: number,
        public status: TourIssueNotificationStatus,
        public tourIssueReportId: number
    ) { }
}

export enum TourIssueNotificationStatus {
    Pending = 'Pending',
    Resolved = 'Resolved',
    Unresolved = 'Unresolved',
}