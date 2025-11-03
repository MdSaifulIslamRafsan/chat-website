export interface TParticipant {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  avatar?: string;
  lastSeen?: string;
}

export interface TConversation {
  _id: string;
  isGroup: boolean;
  participants: TParticipant[];
  blockedBy: string | null;
  groupAdmin: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    text: string;
    sender: TParticipant;
    createdAt: string;
  };
  unreadCount?: number;
  groupName?: string;
}
