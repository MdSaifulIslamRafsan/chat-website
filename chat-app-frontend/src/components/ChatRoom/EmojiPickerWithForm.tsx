import { useFormContext } from "react-hook-form";
import EmojiPicker, { Theme } from "emoji-picker-react";
const EmojiPickerWithForm = ({
  showEmojiPicker,
}: {
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
}) => {
  const { setValue, watch } = useFormContext();
  const currentMessage = watch("message") || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmojiClick = (emojiData: any) => {
    const textarea = document.getElementById("message") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = currentMessage.substring(0, start);
    const after = currentMessage.substring(end);

    const updatedMessage = before + emojiData.emoji + after;

    // Use React Hook Form's setValue to update the form state
    setValue("message", updatedMessage, { shouldValidate: true });

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        start + emojiData.emoji.length;
    }, 0);
  };

  if (!showEmojiPicker) return null;

  return (
    <div className="absolute bottom-16 right-0 z-50">
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
  );
};
export default EmojiPickerWithForm;
