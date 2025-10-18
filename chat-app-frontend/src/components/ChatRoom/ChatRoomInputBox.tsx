/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "../ui/button";
import { Paperclip, Send, Smile } from "lucide-react";

import CForm from "../form/CForm";
import CTextarea from "../form/CTextarea";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import EmojiPickerWithForm from "./EmojiPickerWithForm";

const ChatRoomInputBox = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log("Submitted data:", data);
    if (!data.message?.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text: data.message,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    console.log(newMsg);
    setShowEmojiPicker(false);
  };

  return (
    <div className="border-t border-border p-4 flex items-center gap-2 bg-background sticky bottom-0">
      <Button variant="ghost" size="icon" type="button">
        <Paperclip className="h-5 w-5" />
      </Button>

      <CForm
        styles="flex flex-1 items-center gap-2"
        onSubmit={onSubmit}
        defaultValues={{ message: "" }}
      >
        <div className="flex-1 relative w-full">
          <CTextarea fieldName="message" placeholder="Write a message..." />

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <EmojiPickerWithForm
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
        />

        <Button size="icon" type="submit">
          <Send className="h-4 w-4" />
        </Button>
      </CForm>
    </div>
  );
};

export default ChatRoomInputBox;
