import { useAppSelector } from "../redux/hooks";

const useCurrentConversation = (id: string) => {
  const conversations = useAppSelector(
    (state) => state.conversation.conversations
  );

  const currentConversation = conversations?.find(
    (conv) => conv?._id === id
  );

  return { currentConversation, conversations };
};

export default useCurrentConversation;
