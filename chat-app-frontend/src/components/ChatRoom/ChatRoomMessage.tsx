import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { useGetMessagesQuery } from "../../redux/features/message/messageApi";
import { setMessages } from "../../redux/features/message/messageSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import FormateDate from "../../utils/FormateDate";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ChatRoomSkeleton from "../Skeleton/ChatRoomMessageSkeleton";
import useCurrentConversation from "../../hooks/useCurrentConversation";

const ChatRoomMessage = ({
  id,
  conversationId,
  typingUsers,
}: {
  id: string;
  conversationId: string;
  typingUsers: string[];
}) => {
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  console.log("Typing users in ChatRoomMessage:", typingUsers);
  const { data, isLoading } = useGetMessagesQuery(conversationId, {
  refetchOnMountOrArgChange: true,
});
  console.log(data);
  const messages = useAppSelector((state) => state.message.messages);
  const { currentConversation } = useCurrentConversation(
    conversationId as string
  );
  console.log("Current conversation in ChatRoomMessage:", currentConversation);

  useEffect(() => {
    if (data?.data) {
      dispatch(setMessages(data.data));
    }
  }, [data, dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [messages, typingUsers]);

  if (isLoading) {
    return <ChatRoomSkeleton></ChatRoomSkeleton>;
  }
  let lastDateLabel = "";

  const typingUsersInfo = currentConversation?.participants?.filter(
    (participant) =>
      participant._id !== id && typingUsers.includes(participant._id)
  );

  console.log("Typing users info in ChatRoomMessage:", typingUsersInfo);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[calc(100vh-15rem)] p-4 space-y-3 bg-muted/10">
      {messages.map((msg, index) => {
        const currentDateLabel = FormateDate(msg.createdAt);
        const showDateLabel = currentDateLabel !== lastDateLabel;
        if (showDateLabel) lastDateLabel = currentDateLabel;
        return (
          <div key={msg._id} className="">
            {showDateLabel && (
              <p className="text-center text-sm font-semibold text-muted-foreground">
                {currentDateLabel}
              </p>
            )}
            <div
              className={cn(
                "flex flex-col max-w-[80%]",
                msg?.sender?._id === id
                  ? "ml-auto items-end"
                  : "mr-auto items-start"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2",
                  msg?.sender?._id === id ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar>
                  <AvatarImage src={msg?.sender?.avatar} />
                  <AvatarFallback>
                    {msg?.sender?.name?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="">
                  <p
                    className={cn(
                      "text-xs text-muted-foreground mt-2",
                      msg?.sender?._id === id
                        ? "text-right mr-2"
                        : "text-left ml-2"
                    )}
                  >
                    {" "}
                    {msg?.sender?.name?.split(" ")[0]}
                  </p>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm shadow-sm whitespace-pre-line",
                      msg?.sender?._id === id
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none"
                    )}
                  >
                    {msg.text}
                  </div>
                  <p
                    className={cn(
                      "text-xs text-muted-foreground mt-2",
                      msg?.sender?._id === id
                        ? "text-right mr-2"
                        : "text-left ml-2"
                    )}
                  >
                    {new Date(msg.createdAt).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
            {index === messages.length - 1 && <div ref={messagesEndRef} />}
          </div>
        );
      })}
      {/* 🟢 Typing indicator */}
      {typingUsersInfo && typingUsersInfo.length > 0 && (
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground animate-pulse">
          {/* Typing Avatars */}
          <div className="flex -space-x-2">
            {typingUsersInfo.slice(0, 3).map((user) => (
              <Avatar
                key={user._id}
                className="w-6 h-6 border-2 border-background"
              >
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name?.slice(0, 1)}</AvatarFallback>
              </Avatar>
            ))}
            {typingUsersInfo.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-muted text-xs flex items-center justify-center border-2 border-background">
                +{typingUsersInfo.length - 3}
              </div>
            )}
          </div>

          {/* Typing text */}
          <div className="flex gap-2 items-center ">
            <p>
              {typingUsersInfo.length === 1
                ? `${typingUsersInfo[0].name?.split(" ")[0]} is typing`
                : typingUsersInfo.length === 2
                ? `${typingUsersInfo[0].name?.split(" ")[0]} and ${
                    typingUsersInfo[1].name?.split(" ")[0]
                  } are typing`
                : `${typingUsersInfo[0].name?.split(" ")[0]}, ${
                    typingUsersInfo[1].name?.split(" ")[0]
                  } and ${typingUsersInfo.length - 2} others are typing`}
            </p>

            <div className="flex mt-2 space-x-1">
              <span className="w-1 h-1 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoomMessage;
