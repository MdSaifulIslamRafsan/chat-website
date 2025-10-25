import { useParams } from "react-router-dom";
import ChatRoomHeader from "../components/ChatRoom/ChatRoomHeader";
import ChatRoomInputBox from "../components/ChatRoom/ChatRoomInputBox";
import ChatRoomMessage from "../components/ChatRoom/ChatRoomMessage";
import { useAppSelector } from "../redux/hooks";
import useSocketEvents from "../hooks/useSocketEvents";

const ChatRoom = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { id } = useParams();

  const { emitTyping, emitStopTyping, typingUsers } = useSocketEvents({
    id: user?.id as string,
    conversationId: id as string,
  });

  return (
    <div
      className={"flex flex-col w-full max-h-[calc(100vh-4rem)] bg-background"}
    >
      {/* Header */}
      <ChatRoomHeader></ChatRoomHeader>
      {/* Chat Messages */}
      <ChatRoomMessage
        conversationId={id as string}
        id={user?.id as string}
        typingUsers={typingUsers}
      ></ChatRoomMessage>
      <ChatRoomInputBox
        conversationId={id as string}
        id={user?.id as string}
        emitTyping={emitTyping}
        emitStopTyping={emitStopTyping}
      ></ChatRoomInputBox>
    </div>
  );
};

export default ChatRoom;
