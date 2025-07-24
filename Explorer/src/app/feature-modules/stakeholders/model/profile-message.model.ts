export interface ProfileMessage {
  senderId?: number;  
  recipientId: number;
  text: string;
  resource?: string;
  sentAt?: string;  
}