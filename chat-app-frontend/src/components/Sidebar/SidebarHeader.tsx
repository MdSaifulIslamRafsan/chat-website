import {
  LogOut,
  Moon,
  MoreHorizontalIcon,
  Sun,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { logout } from "../../redux/features/auth/authSlice";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useTheme } from "../../utils/useTheme";
import { showOnlyChat } from "../../redux/features/layoutSlice";

import { socket } from "../../utils/socket";
import { cn } from "../../lib/utils";
interface SidebarHeaderProps {
  setOpenGroupModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  setOpenGroupModal,
  setOpenUserModal,
  setSearchTerm,
}) => {
  const { showSidebar } = useAppSelector((state) => state.layout);
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    socket.disconnect();
    dispatch(logout());
    toast.success("logout successfully");
  };
  const { isConnected } = useAppSelector((state) => state.auth);

  const handelSingleUserModal = () => {
    setOpenUserModal(true);
    setSearchTerm("");
  };
  const handleGroupUserModal = () => {
    setOpenGroupModal(true);
    setSearchTerm("");
  };

  return (
    <div className="p-5 border-b border-border flex justify-between items-center">
      <div className="relative">
        <h5 className="font-bold text-lg">Chats</h5>
        <span
          className={cn(
            "absolute top-0 -right-5 w-3 h-3 rounded-full border-2 border-background",
            isConnected ? "bg-green-500" : "bg-gray-400"
          )}
        />
      </div>
      <div className="flex items-center gap-2">
        <ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More Options">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handelSingleUserModal}>
                  <Button size="icon" variant="ghost">
                    <UserRound />
                  </Button>
                  Single Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleGroupUserModal}>
                  <Button size="icon" variant="ghost">
                    <UsersRound />
                  </Button>
                  Group Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <Button size="icon" variant="ghost">
                    <LogOut />
                  </Button>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="outline"
          size="icon"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" />
          <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
        </Button>
        {showSidebar && (
          <X
            onClick={() => dispatch(showOnlyChat())}
            className="md:hidden cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
