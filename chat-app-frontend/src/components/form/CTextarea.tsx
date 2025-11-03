import { useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import type { TCTextarea } from "../../Types/CTextareaTypes";
import { useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { socket } from "../../utils/socket";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const CTextarea = ({ fieldName, label, placeholder, required }: TCTextarea) => {
  const { control } = useFormContext();
  const { id: conversationId } = useParams();
  const { user } = useAppSelector((state) => state.auth);
  const emitTyping = useMemo(
    () =>
      debounce(
        () => socket.emit("typing", { userId: user?.id, conversationId }),
        300
      ),
    [user?.id, conversationId]
  );
  const emitStopTyping = useMemo(
    () =>
      debounce(
        () =>
          socket.emit("stop_typing", {
            userId: user?.id,
            conversationId,
          }),
        2000
      ),
    [conversationId, user?.id]
  );
  useEffect(() => {
    return () => {
      emitTyping.cancel?.();
      emitStopTyping.cancel?.();
    };
  }, [emitTyping, emitStopTyping]);

  // const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel htmlFor={fieldName}>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              {...field}
              id={fieldName}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const form = e.currentTarget.closest("form");
                  if (form) form.requestSubmit();
                }
                emitTyping?.();
                emitStopTyping?.();
              }}
              rows={1}
              className="flex-1 w-full resize-none overflow-y-auto custom-scrollbar h-10 max-h-24 pl-3 pr-10 py-2 rounded-md border border-input bg-background focus-visible:outline-none "
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CTextarea;
