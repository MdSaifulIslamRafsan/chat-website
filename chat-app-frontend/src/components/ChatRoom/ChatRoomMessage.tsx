import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { useGetMessagesQuery } from "../../redux/features/message/messageApi";
import { setMessages } from "../../redux/features/message/messageSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import FormateDate from "../../utils/FormateDate";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ChatRoomMessage = ({
  id,
  conversationId,
}: {
  id: string;
  conversationId: string;
}) => {
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const { data, isLoading } = useGetMessagesQuery(conversationId);
  const messages = useAppSelector((state) => state.message.messages);

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
  }, [messages]);

  if (isLoading) {
    return (
      <div className="h-full">
        <p className="text-center text-muted-foreground">Loading messages...</p>
      </div>
    );
  }
  let lastDateLabel = "";

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-muted/10">
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
                      "rounded-2xl px-4 py-2 text-sm shadow-sm",
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
    </div>
  );
};

export default ChatRoomMessage;
