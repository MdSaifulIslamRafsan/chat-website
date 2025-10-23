/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "../ui/button";
import { Paperclip, Send, Smile } from "lucide-react";

import CForm from "../form/CForm";
import CTextarea from "../form/CTextarea";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import EmojiPickerWithForm from "./EmojiPickerWithForm";

import { toast } from "sonner";
import type { TErrorMessage } from "../../Types/errorMessageTypes";

import { useCreateMessageMutation } from "../../redux/features/message/messageApi";

const ChatRoomInputBox = ({
  id,
  conversationId,
  emitTyping,
  emitStopTyping,
}: {
  id: string;
  conversationId: string;
  emitTyping?: (event?: React.ChangeEvent<HTMLTextAreaElement>) => void;
  emitStopTyping?: (event?: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [createMessage, { isLoading }] = useCreateMessageMutation();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (isLoading) return;
    if (!data.message?.trim()) return;

    try {
      await createMessage({
        conversationId,
        text: data.message,
        sender: id,
      }).unwrap();
    } catch (error: unknown) {
      toast.error(`something went wrong ${(error as TErrorMessage).message}`, {
        duration: 2000,
      });
    }

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
          <CTextarea
            emitTyping={emitTyping}
            emitStopTyping={emitStopTyping}
            fieldName="message"
            placeholder="Write a message..."
          />

          <Button
            variant="ghost"
            size="icon"
            type="button"
            data-emoji-button
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
