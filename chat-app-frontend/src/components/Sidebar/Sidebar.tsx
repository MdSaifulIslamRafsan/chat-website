import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { showOnlyChat } from "../../redux/features/layoutSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "../modal";
import SidebarHeader from "./SidebarHeader";
import {
  useCreateConversationMutation,
  useGetConversationQuery,
  useGetUserForGroupConversationQuery,
  useGetUserForSingleConversationQuery,
} from "../../redux/features/Conversation/conversationApi";
import type { createConversationUserTypes } from "../../Types/createConversationUserTypes";
import { socket } from "../../utils/socket";
import { toast } from "sonner";
import type { TErrorMessage } from "../../Types/errorMessageTypes";
import type { TConversation } from "../../Types/conversationTypes";
import { getGroupDisplayName } from "./helperFunction";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isUsersConnected, setIsUsersConnected] = useState<string[]>([]);
  console.log({ isConnected });
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: userForSingleConversation,
    isLoading: loadingForSingleConversation,
  } = useGetUserForSingleConversationQuery(user?.id);
  const {
    data: userForGroupConversation,
    isLoading: loadingForGroupConversation,
  } = useGetUserForGroupConversationQuery(user?.id);
  const [createConversation, { isLoading: createConversationLoading }] =
    useCreateConversationMutation();
  const [conversations, setConversations] = useState<TConversation[]>([]);
  const { data, isLoading } = useGetConversationQuery(user?.id);

  useEffect(() => {
    setConversations(data?.data || []);
  }, [data?.data]);

  console.log(conversations);

  const [openUserModal, setOpenUserModal] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<string[]>([]);

  useEffect(() => {
    function onConnect() {
      socket.emit("userId", user?.id);
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    function getOnlineUser(onlineUsers: string[]) {
      console.log("Currently online:", onlineUsers);
      setIsUsersConnected(onlineUsers);
    }

    function getConversation(newConversation: TConversation) {
      console.log({ newConversation });
      setConversations((pev) => [...pev, newConversation]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("update_online_users", getOnlineUser);
    socket.on("new_conversation", getConversation);
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update_online_users", getOnlineUser);
      socket.off("new_conversation", getConversation);
    };
  }, [user?.id]);

  const handleUserClick = useCallback(() => {
    dispatch(showOnlyChat());
  }, [dispatch]);

  // Create Single Chat
  const handleCreateChat = async () => {
    const toastId = toast.loading("logging in...");
    try {
      const res = await createConversation({
        participants: [selectedGroupUsers[0], user?.id],
        isGroup: false,
      }).unwrap();
      toast.success(res?.message || `User login successfully`, {
        id: toastId,
        duration: 2000,
      });
      setSelectedGroupUsers([]);
      setOpenUserModal(false);
    } catch (error) {
      toast.error(`something went wrong ${(error as TErrorMessage).message}`, {
        id: toastId,
        duration: 2000,
      });
    }
  };

  //  Create Group Chat
  const handleCreateGroup = async () => {
    const toastId = toast.loading("logging in...");
    try {
      const res = await createConversation({
        participants: [...selectedGroupUsers, user?.id],
        isGroup: true,
        groupName: "sa",
      }).unwrap();
      toast.success(res?.message || `User login successfully`, {
        id: toastId,
        duration: 2000,
      });
      setSelectedGroupUsers([]);
      setOpenGroupModal(false);
    } catch (error) {
      toast.error(`something went wrong ${(error as TErrorMessage).message}`, {
        id: toastId,
        duration: 2000,
      });
    }
  };

  const toggleGroupUser = (id: string) => {
    setSelectedGroupUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };
  if (isLoading) {
    return "loading...";
  }
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full border-r border-border flex flex-col">
      {/* Header */}
      <SidebarHeader
        isConnected={isConnected}
        setOpenGroupModal={setOpenGroupModal}
        setOpenUserModal={setOpenUserModal}
      ></SidebarHeader>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {conversations?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv: TConversation) => {
            if (conv?.isGroup) {
              const groupDisplayName = getGroupDisplayName(
                conv,
                user?.id as string
              );

              return (
                <Link
                  to={`/${conv?._id}`}
                  key={conv?._id}
                  onClick={handleUserClick}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-muted transition"
                >
                  <div className="flex gap-3 items-center">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?img=5" />
                      <AvatarFallback>G</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-semibold">{groupDisplayName}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {conv?.lastMessage ||
                          `Group with ${conv.participants.length} members`}
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
              (participant) => participant._id !== user?.id
            );

            if (!otherUser) {
              console.warn("Other user not found in conversation:", conv?._id);
              return null;
            }

            return (
              <Link
                to={`/${conv?._id}`}
                key={conv?._id}
                onClick={handleUserClick}
                className="flex justify-between items-center gap-3 p-3 rounded-xl hover:bg-muted transition"
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
                      {conv?.lastMessage || "Start a conversation"}
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

      {loadingForSingleConversation ? (
        "Loading"
      ) : (
        <Modal
          title="Start a New Chat"
          description="Select one user to start a 1-to-1 conversation"
          open={openUserModal}
          onOpenChange={setOpenUserModal}
        >
          <div className="space-y-2 max-h-[300px] custom-scrollbar overflow-y-auto">
            {userForSingleConversation?.data?.length > 0 ? (
              userForSingleConversation?.data?.map(
                (user: createConversationUserTypes) => (
                  <div
                    key={user._id}
                    onClick={() => setSelectedGroupUsers([user?._id])}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition",
                      selectedGroupUsers.includes(user?._id)
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted border-transparent"
                    )}
                  >
                    <Avatar>
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className=" text-muted-foreground text-center py-4">
                No users found to start a conversation.
              </p>
            )}
          </div>

          {selectedGroupUsers.length > 0 &&
            userForSingleConversation?.data?.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleCreateChat}>
                  {createConversationLoading ? "Loading" : "Start Chat"}
                </Button>
              </div>
            )}
        </Modal>
      )}
      {/*  Single Chat Modal */}

      {/* Group Chat Modal */}
      {loadingForGroupConversation ? (
        "loading"
      ) : (
        <Modal
          title="Create a Group Chat"
          description="Select multiple users to start a group chat"
          open={openGroupModal}
          onOpenChange={setOpenGroupModal}
        >
          <div className="space-y-2 max-h-[300px] custom-scrollbar overflow-y-auto">
            {userForGroupConversation?.data.length > 0 ? (
              userForGroupConversation?.data?.map(
                (user: createConversationUserTypes) => (
                  <div
                    key={user?._id}
                    onClick={() => toggleGroupUser(user?._id)}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition",
                      selectedGroupUsers.includes(user?._id)
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted border-transparent"
                    )}
                  >
                    <Avatar>
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className=" text-muted-foreground text-center py-4">
                No users found to start a group conversation.
              </p>
            )}
          </div>

          {selectedGroupUsers.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Sidebar;
