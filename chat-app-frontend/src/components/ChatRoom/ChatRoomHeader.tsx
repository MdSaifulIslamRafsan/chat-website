import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { showOnlySidebar } from "../../redux/features/layoutSlice";
import { useParams } from "react-router-dom";
import { getGroupDisplayName } from "../../utils/helperFunction";
import type { TConversation } from "../../Types/conversationTypes";
import formatLastSeen from "../../utils/formatLastSeen";
import { cn } from "../../lib/utils";
import useCurrentConversation from "../../hooks/useCurrentConversation";

const ChatRoomHeader = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { onlineUsers } = useAppSelector((state) => state.conversation);

  const { id } = useParams();
  const { currentConversation } = useCurrentConversation(id as string);
  const handleUserClick = () => {
    dispatch(showOnlySidebar());
  };
  const otherUser = currentConversation?.participants?.find(
    (participant) => participant?._id !== user?.id
  );
  const groupDisplayName = getGroupDisplayName(
    currentConversation as TConversation,
    id as string
  );

  return (
    <div className="flex items-center justify-between border-b border-border p-4">
      <div className="flex items-center gap-2">
        <Button
          className="md:hidden"
          onClick={handleUserClick}
          size="icon"
          variant="ghost"
        >
          <ArrowLeft className="w-5 h-5"></ArrowLeft>
        </Button>
        <div className="relative">
          {currentConversation?.isGroup ? (
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?img=5" />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar>
              <AvatarImage src={otherUser?.avatar} />
              <AvatarFallback>{otherUser?.name?.slice(0, 1)}</AvatarFallback>
            </Avatar>
          )}
          <span
            className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
              onlineUsers.includes(otherUser?._id as string)
                ? "bg-green-500"
                : "bg-gray-400"
            )}
          />
        </div>

        <div>
          <h2 className="font-semibold md:text-lg line-clamp-1">
            {currentConversation?.isGroup ? groupDisplayName : otherUser?.name}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            {currentConversation?.isGroup
              ? "Online"
              : onlineUsers?.includes(otherUser?._id as string)
              ? "online"
              : formatLastSeen(otherUser?.lastSeen as string)}
          </p>
        </div>
      </div>
      {/* <div className="flex gap-2 items-center">
        <Button size="icon" variant="ghost">
          <Phone className="h-5 w-5"></Phone>
        </Button>
        <Button size="icon" variant="ghost">
          <Video className="h-5 w-5"></Video>
        </Button>
      </div> */}
    </div>
  );
};

export default ChatRoomHeader;
