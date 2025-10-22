import { useEffect } from "react";
import { cn } from "../../lib/utils";
import { useGetMessagesQuery } from "../../redux/features/message/messageApi";
import { setMessages } from "../../redux/features/message/messageSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const ChatRoomMessage = ({
  id,
  conversationId,
}: {
  id: string;
  conversationId: string;
}) => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetMessagesQuery(conversationId);
  const messages = useAppSelector((state) => state.message.messages);
  console.log({ messages });

  useEffect(() => {
    if (data?.data) {
      dispatch(setMessages(data.data));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return "loading...";
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-muted/10">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={cn(
            "flex flex-col max-w-[80%]",
            msg?.sender?._id === id
              ? "ml-auto items-end"
              : "mr-auto items-start"
          )}
        >
          <div
            className={cn(
              "rounded-2xl px-4 py-2 text-sm shadow-sm",
              msg?.sender?._id === id
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-muted text-foreground rounded-tl-none"
            )}
          >
            {msg.text}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">
            {msg.time}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomMessage;
