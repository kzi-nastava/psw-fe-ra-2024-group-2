export interface Image {
    data: string;
    uploadedAt: Date;
    mimeType: number; 
}

export interface Blog {
    id: number;
    title: string;
    description: string;
    date: Date;
    status: number;
    authorId: number;
    images: Image[];
}

export enum MimeType {
    Jpeg = 0,
    Png = 1,
    Gif = 2
  }
