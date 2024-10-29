export interface Image {
    data: string;
    uploadedAt: Date;
    mimeType: string; 
}

export interface Blog {
    id: number;
    title: string;
    description: string;
    date: Date;
    status: string;
    authorId: number;
    images: Image[];
}
