export interface Comment{
    id: number;
    blogId: number;
    userId: number;
    createdAt: Date;
    text: string;
    lastModifiedAt: Date;
    author: Person;
}

export interface Image {
    data: string;
    uploadedAt: Date;
    mimeType: number; 
}

export interface Person {
    id: number;
    name: string;
    lastName: string;
    username: string;
    profileImage: Image | null;
}

export interface CommentWithAuthor{
    comment: Comment;
    author: Person;
}