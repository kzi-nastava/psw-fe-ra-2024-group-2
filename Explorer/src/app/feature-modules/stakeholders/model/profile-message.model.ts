export interface ProfileMessage {
    senderId: number;      
    recipientId: number;  
    text: string;          
    resource?: string;     // opciono polje za resurs (link ili ID)
    sentAt: Date;         
  }
  