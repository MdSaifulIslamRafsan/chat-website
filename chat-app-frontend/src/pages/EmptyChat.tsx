import { MessageCircle, Sparkles } from "lucide-react";
import { useAppDispatch } from "../redux/hooks";
import { showOnlySidebar } from "../redux/features/layoutSlice";

const EmptyChat = () => {
  const dispatch = useAppDispatch();

  const handleUserClick = () => {
    dispatch(showOnlySidebar());
  };
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] w-full items-center justify-center h-full text-center px-6">
      <div className="relative">
        <div className="absolute -inset-4 blur-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-30 rounded-full"></div>
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-2xl shadow-2xl">
          <MessageCircle className="w-16 h-16 text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
        Welcome to ChatSpace ✨
      </h2>

      <p className="text-gray-500 mt-2 max-w-md">
        Start a conversation by selecting a chat from the sidebar. Connect,
        collaborate, and share your thoughts instantly.
      </p>

      <button
        onClick={handleUserClick}
        className="mt-6 inline-flex md:hidden items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        <Sparkles className="w-5 h-5" />
        Explore Chats
      </button>
    </div>
  );
};

export default EmptyChat;
