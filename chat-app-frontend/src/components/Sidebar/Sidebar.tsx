import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";

import { useAppSelector } from "../../redux/hooks";
import { useState } from "react";
import { Modal } from "../modal";
import SidebarHeader from "./SidebarHeader";
import {
  useCreateConversationMutation,
  useGetUserForGroupConversationQuery,
  useGetUserForSingleConversationQuery,
} from "../../redux/features/Conversation/conversationApi";

import type { createConversationUserTypes } from "../../Types/createConversationUserTypes";

import { toast } from "sonner";
import type { TErrorMessage } from "../../Types/errorMessageTypes";

import useSocketEvents from "../../hooks/useSocketEvents";
import ConversationsList from "./ConversationsList";

const Sidebar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { isConnected, isUsersConnected } = useSocketEvents({
    id: user?.id as string,
  });
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

  const [openUserModal, setOpenUserModal] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<string[]>([]);

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
        // groupName: "sa",
        groupAdmin: [user?.id],
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

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full border-r border-border flex flex-col">
      {/* Header */}
      <SidebarHeader
        isConnected={isConnected}
        setOpenGroupModal={setOpenGroupModal}
        setOpenUserModal={setOpenUserModal}
      ></SidebarHeader>

      {/* Conversations List */}
      
      <ConversationsList
        id={user?.id as string}
        isUsersConnected={isUsersConnected}
      ></ConversationsList>

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
