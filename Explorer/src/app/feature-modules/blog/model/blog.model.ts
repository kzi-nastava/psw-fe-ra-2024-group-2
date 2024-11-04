export interface Image {
    data: string;
    uploadedAt: Date;
    mimeType: string; 
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
    status: string;
    authorId: number;
    images: Image[];
    ratings: Rating[];
    userVote?: 'Upvote' | 'Downvote' | null; // Add userVote here

}
