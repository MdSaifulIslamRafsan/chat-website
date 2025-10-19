import { useFormContext } from "react-hook-form";
import EmojiPicker, { Theme } from "emoji-picker-react";
import React, { useCallback, useEffect, useRef } from "react";
const EmojiPickerWithForm = ({
  showEmojiPicker,
  setShowEmojiPicker,
}: {
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
}) => {
  const { setValue,  getValues } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);


  // Textarea reference setup
  useEffect(() => {
    if (showEmojiPicker) {
      textareaRef.current = document.getElementById(
        "message"
      ) as HTMLTextAreaElement;
    }
  }, [showEmojiPicker]);


  const handleEmojiClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (emojiData: any) => {
      const textarea = textareaRef.current;

      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = getValues("message") || "";

      const newValue =
        currentValue.substring(0, start) +
        emojiData.emoji +
        currentValue.substring(end);

      setValue("message", newValue, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + emojiData.emoji.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [setValue, getValues]
  );
  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const emojiPicker = document.querySelector(".EmojiPickerReact");
      const emojiButton = document.querySelector("[data-emoji-button]");
      console.log({ emojiPicker, emojiButton });
      if (
        showEmojiPicker &&
        emojiPicker &&
        !emojiPicker.contains(event.target as Node) &&
        !emojiButton?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, setShowEmojiPicker]);

  if (!showEmojiPicker) return null;

  return (
    <div className="absolute bottom-16 right-0 z-50">
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        searchDisabled
        width="100%"
        theme={
          document.documentElement.classList.contains("dark")
            ? Theme.DARK
            : Theme.LIGHT
        }
      />
    </div>
  );
};
export default React.memo(EmojiPickerWithForm);
