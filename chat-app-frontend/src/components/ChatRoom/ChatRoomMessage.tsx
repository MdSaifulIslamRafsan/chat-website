import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { useGetMessagesQuery } from "../../redux/features/message/messageApi";
import {
  addOlderMessages,
  setMessages,
} from "../../redux/features/message/messageSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import FormateDate from "../../utils/FormateDate";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ChatRoomSkeleton from "../Skeleton/ChatRoomMessageSkeleton";
import useCurrentConversation from "../../hooks/useCurrentConversation";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const ChatRoomMessage = ({
  id,
  conversationId,
}: {
  id: string;
  conversationId: string;
}) => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { typingUsers } = useAppSelector((state) => state.message);
  const { data, isFetching } = useGetMessagesQuery(
    { conversationId, page, limit },
    {
      refetchOnMountOrArgChange: true,
      skip: !conversationId,
    }
  );

  const messages = useAppSelector((state) => state.message.messages);
  const prevCountRef = useRef(messages.length);
  const { currentConversation } = useCurrentConversation(
    conversationId as string
  );

  const containerRef = useInfiniteScroll({
    onLoadMore: () => setPage((prev) => prev + 1),
    isLoading: isFetching,
    direction: "up",
  });

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        dispatch(setMessages([...data.data]));

        setTimeout(() => {
          if (containerRef.current)
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }, 2000);
      } else {
        const container = containerRef.current;
        if (!container) return;

        const prevHeight = container.scrollHeight;

        dispatch(addOlderMessages([...data.data]));

        setTimeout(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - prevHeight;
        }, 100);
      }
    }
  }, [data, containerRef, dispatch, page]);

  useEffect(() => {
    setPage(1);
  }, [conversationId]);
  const typingUsersInfo = currentConversation?.participants?.filter(
    (participant) =>
      participant?._id !== id && typingUsers?.includes(participant?._id)
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (
      messages.length > prevCountRef.current ||
      ((typingUsersInfo?.length ?? 0) > 0 && isNearBottom)
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevCountRef.current = messages?.length;
  }, [messages, typingUsersInfo, containerRef]);

  let lastDateLabel = "";

  if (isFetching && page === 1) {
    return <ChatRoomSkeleton />;
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto custom-scrollbar min-h-[calc(100vh-15rem)] p-4 space-y-3 bg-muted/10"
    >
      {isFetching && page > 1 && (
        <p className="text-center text-sm text-muted-foreground">
          Loading older messages...
        </p>
      )}
      {messages.map((msg, index) => {
        const currentDateLabel = FormateDate(msg.createdAt);
        const showDateLabel = currentDateLabel !== lastDateLabel;
        if (showDateLabel) lastDateLabel = currentDateLabel;
        return (
          <div key={msg?._id} className="">
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
                    {new Date(msg?.createdAt).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
            {index === messages?.length - 1 && <div ref={messagesEndRef} />}
          </div>
        );
      })}
      {/* 🟢 Typing indicator */}
      {typingUsersInfo && typingUsersInfo?.length > 0 && (
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground animate-pulse">
          {/* Typing Avatars */}
          <div className="flex -space-x-2">
            {typingUsersInfo?.slice(0, 3)?.map((user) => (
              <Avatar
                key={user?._id}
                className="w-6 h-6 border-2 border-background"
              >
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.slice(0, 1)}</AvatarFallback>
              </Avatar>
            ))}
            {typingUsersInfo?.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-muted text-xs flex items-center justify-center border-2 border-background">
                +{typingUsersInfo?.length - 3}
              </div>
            )}
          </div>

          {/* Typing text */}
          <div className="flex gap-2 items-center ">
            <p>
              {typingUsersInfo.length === 1
                ? `${typingUsersInfo[0]?.name?.split(" ")[0]} is typing`
                : typingUsersInfo.length === 2
                ? `${typingUsersInfo[0]?.name?.split(" ")[0]} and ${
                    typingUsersInfo[1]?.name?.split(" ")[0]
                  } are typing`
                : `${typingUsersInfo[0]?.name?.split(" ")[0]}, ${
                    typingUsersInfo[1]?.name?.split(" ")[0]
                  } and ${typingUsersInfo?.length - 2} others are typing`}
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
