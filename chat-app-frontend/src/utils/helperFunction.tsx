import type { TConversation } from "../Types/conversationTypes";



export const getGroupDisplayName = (
  conversation: TConversation,
  id: string
): string => {
  if (conversation?.groupName) {
    return conversation?.groupName;
  }

  // Get participant names excluding current user
  const otherParticipants = conversation?.participants?.filter(
    (participant) => participant?._id !== id
  );

  if (otherParticipants?.length === 0) {
    return "Empty Group";
  }

  const names = otherParticipants?.slice(0, 2)?.map((p) => p.name);
  return `${names?.join(", ")}${otherParticipants?.length > 1 ? "..." : ""}`;
};
