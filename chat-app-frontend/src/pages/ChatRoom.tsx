import { useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";

import { Button } from "../components/ui/button";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Textarea } from "../components/ui/textarea";
import type { TMessage } from "../Types/MessageTypes";
import ChatRoomHeader from "../components/ChatRoom/ChatRoomHeader";
import ChatRoomMessage from "../components/ChatRoom/ChatRoomMessage";

const ChatRoom = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([
    {
      id: "1",
      text: "Wait. I'm looking into it!",
      sender: "me",
      time: "10:58 AM",
    },
    {
      id: "2",
      text: "Let me know if it works or not?",
      sender: "other",
      time: "11:11 AM",
    },
    {
      id: "3",
      text: "I checked it. Yep, that works!",
      sender: "me",
      time: "11:13 AM",
    },
    {
      id: "4",
      text: "Perfect! I'll prepare the next phase then.",
      sender: "other",
      time: "11:14 AM",
    },
    {
      id: "5",
      text: "Sounds good. When do you think it'll be ready?",
      sender: "me",
      time: "11:15 AM",
    },
    {
      id: "6",
      text: "Should be done by tomorrow morning.",
      sender: "other",
      time: "11:15 AM",
    },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji;
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = newMessage.substring(0, start);
    const after = newMessage.substring(end);

    const updatedMessage = before + emoji + after;
    setNewMessage(updatedMessage);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    }, 0);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: TMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    setShowEmojiPicker(false);
  };

  return (
    <div className={"flex flex-col w-full h-[calc(100vh-4rem)] bg-background"}>
      {/* Header */}
      <ChatRoomHeader></ChatRoomHeader>
      {/* Chat Messages */}
      <ChatRoomMessage></ChatRoomMessage>

      {/* Input Box */}
      <div className="border-t border-border p-4 flex items-center gap-2 bg-background sticky bottom-0">
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Textarea
          ref={textareaRef}
          placeholder="Write a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          className="flex-1 resize-none overflow-y-auto custom-scrollbar h-10 max-h-24 px-3 py-2 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          rows={1}
        />

        {/* Emoji Button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile className="h-5 w-5" />
          </Button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 -right-16 md:right-0 z-50">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width="100%"
                theme={
                  document.documentElement.classList.contains("dark")
                    ? Theme.DARK
                    : Theme.LIGHT
                }
              />
            </div>
          )}
        </div>
        <Button size="icon" onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
