import { useEffect, useRef } from "react";
import { socket } from "../utils/socket";
import type { TConversation } from "../Types/conversationTypes";
import { useAppDispatch } from "../redux/hooks";
import {
  addConversation,
  incrementUnreadCount,
  setOnlineUsers,
} from "../redux/features/Conversation/conversationSlice";
import type { TMessage } from "../Types/MessageTypes";
import { addMessage, setTypingUsers } from "../redux/features/message/messageSlice";

import { useParams } from "react-router-dom";
import { setIsConnected } from "../redux/features/auth/authSlice";

const useSocketEvents = ({
  id,
  conversationId,
}: {
  id: string;
  conversationId?: string;
}) => {
  const dispatch = useAppDispatch();
  const { id: currentConversationId } = useParams();

  const currentConvIdRef = useRef<string | undefined>(currentConversationId);
  useEffect(() => {
    currentConvIdRef.current = currentConversationId;
  }, [currentConversationId]);

  useEffect(() => {
    function onConnect() {
      socket.emit("userId", id);
      dispatch(setIsConnected(true));
    }

    function onDisconnect() {
      dispatch(setIsConnected(false));
    }
    function getOnlineUser(onlineUsers: string[]) {
      dispatch(setOnlineUsers(onlineUsers));
    }

    function getConversation(newConversation: TConversation) {
      dispatch(addConversation(newConversation));
    }

    function getMessage(message: TMessage) {
      const msgConvId =
        typeof message.conversationId === "string"
          ? message.conversationId
          : message.conversationId?._id;

      const currentConvId = currentConvIdRef.current;

      if (msgConvId && msgConvId !== currentConvId) {
        
        dispatch(incrementUnreadCount(msgConvId));
      } else {
        dispatch(addMessage(message));
      }
    }

    function getTypingUsers(users: string[]) {
      dispatch(setTypingUsers(users));
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
  }, [id, dispatch]);

  useEffect(() => {
    if (conversationId) {
      socket.emit("join_conversation", conversationId);
    }
  }, [conversationId]);


  
};

export default useSocketEvents;
