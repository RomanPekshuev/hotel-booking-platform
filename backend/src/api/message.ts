export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: Date;
}

export interface CreateMessageDto {
  content: string;
  receiverId: number;
}

export interface MessageResponse {
  success: boolean;
  message: Message | null;
  error?: string;
}