import React, { useCallback, useEffect } from "react";
import type { TConversation } from "../../Types/conversationTypes";
import { Badge } from "../ui/badge";
import { Link, useParams } from "react-router-dom";
import { showOnlyChat } from "../../redux/features/layoutSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useGetConversationQuery } from "../../redux/features/Conversation/conversationApi";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";
import {
  resetUnreadCount,
  setConversations,
} from "../../redux/features/Conversation/conversationSlice";
import { getGroupDisplayName } from "../../utils/helperFunction";
import ConversationsListSkeleton from "../Skeleton/ConversationsListSkeleton";

const ConversationsList = ({
  id,
  isUsersConnected,
}: {
  id: string;
  isUsersConnected: string[];
}) => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetConversationQuery(id);

  const params = useParams();

  const conversations = useAppSelector(
    (state) => state.conversation.conversations
  );


  useEffect(() => {
    if (data?.data) {
      dispatch(setConversations(data.data));
    }
  }, [data, dispatch]);

  const handleUserClick = useCallback(
    (conversationId?: string) => {
      if (!conversationId) return;
      dispatch(showOnlyChat());
      dispatch(resetUnreadCount(conversationId));
    },
    [dispatch]
  );

  if (isLoading) {
    return <ConversationsListSkeleton></ConversationsListSkeleton>;
  }
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[calc(100vh-10rem)] p-4 space-y-3 bg-muted/10">
      {conversations?.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No conversations yet
        </div>
      ) : (
        conversations.map((conv: TConversation) => {
          if (conv?.isGroup) {
            const groupDisplayName = getGroupDisplayName(conv, id as string);

            return (
              <Link
                to={`/${conv?._id}`}
                key={conv?._id}
                onClick={() => handleUserClick(conv?._id)}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-muted transition ${
                  params?.id === conv?._id ? "bg-secondary" : ""
                }`}
              >
                <div className="flex gap-3 items-center">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?img=5" />
                    <AvatarFallback>G</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-semibold">{groupDisplayName}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {conv?.lastMessage?.text ||
                        `Group with ${conv?.participants?.length} members`}
                    </p>
                  </div>
                </div>
                <div>
                  <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                    {conv?.unreadCount || 0}
                  </Badge>
                </div>
              </Link>
            );
          }

          // For one-on-one chats
          const otherUser = conv?.participants?.find(
            (participant) => participant?._id !== id
          );

          if (!otherUser) {
           
            return null;
          }

          return (
            <Link
              to={`/${conv?._id}`}
              key={conv?._id}
              onClick={() => handleUserClick(conv?._id)}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-muted transition ${
                params?.id === conv?._id ? "bg-secondary" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={otherUser?.avatar}
                      alt={otherUser?.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <AvatarFallback>
                      {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                      isUsersConnected.includes(otherUser?._id)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">
                    {otherUser?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {conv?.lastMessage?.text || "Start a conversation"}
                  </p>
                </div>
              </div>
              <div>
                <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                  {conv?.unreadCount || 0}
                </Badge>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default React.memo(ConversationsList);
