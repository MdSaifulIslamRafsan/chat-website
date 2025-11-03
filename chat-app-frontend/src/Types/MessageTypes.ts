export interface Tsender {
  _id: string;
  name: string;
  avatar: string;
}

export interface TMessage {
  _id: string;
  text: string;
  sender: Tsender;
  conversationId: {
    _id: string;
    participants: string[];
  };
  
  createdAt: string;
}
