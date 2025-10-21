import { useParams } from "react-router-dom";
import ChatRoomHeader from "../components/ChatRoom/ChatRoomHeader";
import ChatRoomInputBox from "../components/ChatRoom/ChatRoomInputBox";
import ChatRoomMessage from "../components/ChatRoom/ChatRoomMessage";
import { useAppSelector } from "../redux/hooks";

const ChatRoom = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { id } = useParams();

  console.log(id);

  return (
    <div className={"flex flex-col w-full h-[calc(100vh-4rem)] bg-background"}>
      {/* Header */}
      <ChatRoomHeader></ChatRoomHeader>
      {/* Chat Messages */}
      <ChatRoomMessage
        conversationId={id as string}
        id={user?.id as string}
      ></ChatRoomMessage>
      <ChatRoomInputBox
        conversationId={id as string}
        id={user?.id as string}
      ></ChatRoomInputBox>
    </div>
  );
};

export default ChatRoom;
