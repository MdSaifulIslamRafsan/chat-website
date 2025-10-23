import { useEffect, useMemo, useState } from "react";
import { socket } from "../utils/socket";
import type { TConversation } from "../Types/conversationTypes";
import { useAppDispatch } from "../redux/hooks";
import { addConversation } from "../redux/features/Conversation/conversationSlice";
import type { TMessage } from "../Types/MessageTypes";
import { addMessage } from "../redux/features/message/messageSlice";
import { debounce } from "lodash";

const useSocketEvents = ({
  id,
  participantIds,
}: {
  id: string;
  participantIds?: string[];
}) => {
  const dispatch = useAppDispatch();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isUsersConnected, setIsUsersConnected] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    function onConnect() {
      socket.emit("userId", id);
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
      dispatch(addConversation(newConversation));
    }

    function getMessage(message: TMessage) {
      dispatch(addMessage(message));
    }
    function getTypingUsers(users: string[]) {
      console.log({ users });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("update_online_users", getOnlineUser);
    socket.on("new_conversation", getConversation);
    socket.on("new_message", getMessage);
    socket.on("typing_users", getTypingUsers);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update_online_users", getOnlineUser);
      socket.off("new_conversation", getConversation);
      socket.off("new_message", getMessage);
      socket.off("typing_users", getTypingUsers);
    };
  }, [id, dispatch, participantIds]);

  const emitTyping = useMemo(
    () =>
      debounce(
        () => socket.emit("typing", { userId: id, participantIds }),
        300
      ),
    [id, participantIds]
  );
  const emitStopTyping = useMemo(
    () =>
      debounce(
        () => socket.emit("stop_typing", { userId: id, participantIds }),
        2000
      ),
    [id, participantIds]
  );
  useEffect(() => {
    return () => {
      emitTyping.cancel?.();
      emitStopTyping.cancel?.();
    };
  }, [emitTyping, emitStopTyping]);
  return {
    isConnected,
    isUsersConnected,
    typingUsers,
    emitTyping,
    emitStopTyping,
  };
};

export default useSocketEvents;
