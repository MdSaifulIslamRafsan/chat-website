import ChatRoomHeader from "../components/ChatRoom/ChatRoomHeader";
import ChatRoomInputBox from "../components/ChatRoom/ChatRoomInputBox";
import ChatRoomMessage from "../components/ChatRoom/ChatRoomMessage";

const ChatRoom = () => {
  return (
    <div className={"flex flex-col w-full h-[calc(100vh-4rem)] bg-background"}>
      {/* Header */}
      <ChatRoomHeader></ChatRoomHeader>
      {/* Chat Messages */}
      <ChatRoomMessage></ChatRoomMessage>
      <ChatRoomInputBox></ChatRoomInputBox>
    </div>
  );
};

export default ChatRoom;
