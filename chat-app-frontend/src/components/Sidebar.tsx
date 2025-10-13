import { useTheme } from "../utils/useTheme";
import { Button } from "./ui/button";
import { Moon, Sun, UserRound, UsersRound } from "lucide-react";
import { X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { showOnlyChat } from "../redux/features/layoutSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useState } from "react";
import { Modal } from "./modal";

const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { showSidebar } = useAppSelector((state) => state.layout);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<string[]>([]);

  const handleUserClick = () => {
    dispatch(showOnlyChat());
  };

  const Users = [
    {
      _id: "6710f3a5c1234b001234abcd",
      name: "Md Saiful Islam",
      email: "saiful@example.com",
      gender: "male",
      avatar: "https://i.pravatar.cc/150?img=1",
      isActive: true,
    },
    {
      _id: "6710f3a5c1234b001234abce",
      name: "Jannatul Ferdous",
      email: "jannat@example.com",
      gender: "female",
      avatar: "https://i.pravatar.cc/150?img=2",
      isActive: false,
    },
    {
      _id: "6710f3a5c1234b001234abcf",
      name: "Tawhid Hasan",
      email: "tawhid@example.com",
      gender: "male",
      avatar: "https://i.pravatar.cc/150?img=3",
      isActive: true,
    },
    {
      _id: "6710f3a5c1234b001234abd0",
      name: "Rafi Rahman",
      email: "rafi@example.com",
      gender: "male",
      avatar: "https://i.pravatar.cc/150?img=4",
      isActive: false,
    },
  ];

  const conversations = [
    {
      _id: "6710f4c5c1234b001234abcd",
      groupName: null,
      isGroup: false,
      participants: ["6710f3a5c1234b001234abcd", "6710f3a5c1234b001234abce"],
      lastMessage: "Let's meet tomorrow!",
      updatedAt: "2025-10-12T09:00:00.000Z",
    },
    {
      _id: "6710f4c5c1234b001234abce",
      groupName: "Developers Hangout",
      isGroup: true,
      participants: [
        "6710f3a5c1234b001234abcd",
        "6710f3a5c1234b001234abcf",
        "6710f3a5c1234b001234abd0",
      ],
      lastMessage: "Pushing the latest code update.",
      updatedAt: "2025-10-12T09:20:00.000Z",
    },
    {
      _id: "6710f4c5c1234b001234abcf",
      groupName: null,
      isGroup: false,
      participants: ["6710f3a5c1234b001234abcf", "6710f3a5c1234b001234abd0"],
      lastMessage: "See you later!",
      updatedAt: "2025-10-12T07:00:00.000Z",
    },
  ];

  const currentUserId = "6710f3a5c1234b001234abcd";
  // 🧩 Create Single Chat
  const handleCreateChat = (userId: string) => {
    console.log("Creating single chat with:", userId);
    setOpenUserModal(false);
    // TODO: Create conversation in backend here
  };

  // 🧩 Create Group Chat
  const handleCreateGroup = () => {
    console.log("Creating group chat with:", selectedGroupUsers);
    setOpenGroupModal(false);
    setSelectedGroupUsers([]);
    // TODO: Create group conversation in backend here
  };

  const toggleGroupUser = (id: string) => {
    setSelectedGroupUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-border flex justify-between items-center">
        <h5 className="font-bold text-lg">Chats</h5>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpenUserModal(true)}
          >
            <UserRound />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpenGroupModal(true)}
          >
            <UsersRound />
          </Button>
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="outline"
            size="icon"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" />
            <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
          </Button>
          {showSidebar && (
            <Link to={currentUserId}>
              {" "}
              <X
                onClick={() => dispatch(showOnlyChat())}
                className="md:hidden cursor-pointer"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {conversations.map((conv) => {
          if (conv.isGroup) {
            return (
              <Link
                to={conv._id}
                key={conv._id}
                onClick={() => handleUserClick()}
                className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-muted transition"
              >
                <div className="flex gap-3 items-center">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?img=5" />
                    <AvatarFallback>G</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-semibold">{conv.groupName}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
                <div className="">
                  <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                    8
                  </Badge>
                </div>
              </Link>
            );
          }

          const otherUserId = conv.participants.find(
            (id) => id !== currentUserId
          );
          const otherUser = Users.find((u) => u._id === otherUserId);

          if (!otherUser) return null;

          return (
            <Link
              to={conv._id}
              key={conv._id}
              onClick={() => handleUserClick()}
              className="flex justify-between items-center gap-3 p-3 rounded-xl hover:bg-muted transition"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={otherUser.avatar} />
                    <AvatarFallback>
                      {otherUser.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* ✅ Online indicator */}
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                      otherUser.isActive ? "bg-green-500" : "bg-gray-400"
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">{otherUser.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="">
                  <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                    8
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {/*  Single Chat Modal */}
      <Modal
        title="Start a New Chat"
        description="Choose a user to start a 1-to-1 conversation"
        open={openUserModal}
        onOpenChange={setOpenUserModal}
      >
        <div className="space-y-2">
          {Users.filter((u) => u._id !== currentUserId).map((user) => (
            <div
              key={user._id}
              onClick={() => handleCreateChat(user._id)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted cursor-pointer transition"
            >
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Group Chat Modal */}
      <Modal
        title="Create a Group Chat"
        description="Select multiple users to start a group chat"
        open={openGroupModal}
        onOpenChange={setOpenGroupModal}
      >
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {Users.filter((u) => u._id !== currentUserId).map((user) => (
            <div
              key={user._id}
              onClick={() => toggleGroupUser(user._id)}
              className={cn(
                "flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition",
                selectedGroupUsers.includes(user._id)
                  ? "bg-primary/10 border-primary"
                  : "hover:bg-muted border-transparent"
              )}
            >
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedGroupUsers.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Sidebar;
