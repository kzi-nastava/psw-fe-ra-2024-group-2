export class Chapter {
    chapterId: number; // ID poglavlja
    title: string;
    createdAt: Date;
    text: string;
    personalDairyId: number; 
    image?: Image;
}
export interface Image {
    data: string;
    uploadedAt: Date;
    mimeType: number; 
}
export enum MimeType {
    Jpeg = 0,
    Png = 1,
    Gif = 2
  }