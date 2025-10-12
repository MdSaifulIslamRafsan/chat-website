export interface TMessage {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}