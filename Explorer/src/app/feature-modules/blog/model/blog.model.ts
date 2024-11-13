export interface Image {
    data: string;
    uploadedAt: Date;
    mimeType: number; 
}

export interface Rating {
    username: string;
    createdAt: string;              
    ratingType: "Upvote" | "Downvote";
}

export interface Blog {
    id: number;
    title: string;
    description: string;
    date: Date;
    status: number;
    authorId: number;
    images: Image[];
    ratings: Rating[];
    userVote?: 'Upvote' | 'Downvote' | null;

}

export enum MimeType {
    Jpeg = 0,
    Png = 1,
    Gif = 2
  }
