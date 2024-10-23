export interface Comment{
    id: number;
    blogId: number;
    userId: number;
    createdAt: Date;
    text: string;
    lastModifiedAt: Date;
}