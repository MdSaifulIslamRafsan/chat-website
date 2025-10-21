import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import type { TConversation } from "../Types/conversationTypes";
import { useAppDispatch } from "../redux/hooks";
import { addConversation } from "../redux/features/Conversation/conversationSlice";

const useSocketEvents = ({ id }: { id: string }) => {
    const dispatch = useAppDispatch();


  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isUsersConnected, setIsUsersConnected] = useState<string[]>([]);
  
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
      console.log("New conversation received via socket:", newConversation);
        dispatch(addConversation(newConversation));
      
      // RTK Query cache direct update
      //   conversationApi.util.updateQueryData("getConversation", id, (draft) => {
      //     draft.data = [newConversation, ...draft.data];
      //   });
      //   conversationApi.util.invalidateTags(["Conversation"]);
    //   conversationApi.util.updateQueryData("getConversation", id, (draft) => {
    //     console.log("Current draft data before update:", draft.data);
    //     const exists = draft.data.some(
    //       (c: TConversation) => c._id === newConversation._id
    //     );
    //     console.log({ exists });
    //     if (!exists) {
    //       console.log("Updating cache with new conversation:", [
    //         ...draft.data,
    //         newConversation,
    //       ]);
    //       draft.data = [...draft.data, newConversation];
    //       console.log("Updating cache with new conversation:", draft.data);
    //     }
    //   });
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
  }, [id]);
  return { isConnected, isUsersConnected };
};

export default useSocketEvents;
