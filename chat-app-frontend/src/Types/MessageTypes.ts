export interface TMessage {
  _id: string;
  text: string;
  sender:{
    _id: string;
    name: string;
    avatar: string;
  }
  createdAt: string;
}