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
interface SidebarHeaderProps {
  setOpenGroupModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  setOpenGroupModal,
  setOpenUserModal,
}) => {
  const { showSidebar } = useAppSelector((state) => state.layout);
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
    toast.success("logout successfully");
  };
  return (
    <div className="p-5 border-b border-border flex justify-between items-center">
      <h5 className="font-bold text-lg">Chats</h5>
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
                <DropdownMenuItem onClick={() => setOpenUserModal(true)}>
                  <Button size="icon" variant="ghost">
                    <UserRound />
                  </Button>
                  Single Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenGroupModal(true)}>
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
