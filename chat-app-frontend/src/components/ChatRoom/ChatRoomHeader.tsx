import { Button } from "../ui/button";
import { ArrowLeft, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppDispatch } from "../../redux/hooks";
import { showOnlySidebar } from "../../redux/features/layoutSlice";

const ChatRoomHeader = () => {
  const dispatch = useAppDispatch();

  const handleUserClick = () => {
    dispatch(showOnlySidebar());
  };
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
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?img=5" />
          <AvatarFallback>G</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold md:text-lg line-clamp-1">
            Yong Tonghyon
          </h2>
          <p className="text-[11px] md:text-xs text-muted-foreground">
            Last seen recently
          </p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Button size="icon" variant="ghost">
          <Phone className="h-5 w-5"></Phone>
        </Button>
        <Button size="icon" variant="ghost">
          <Video className="h-5 w-5"></Video>
        </Button>
      </div>
    </div>
  );
};

export default ChatRoomHeader;
