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

const CTextarea = ({ fieldName, label, placeholder, required }: TCTextarea) => {
  const { control } = useFormContext();
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
              rows={1}
              className="flex-1 w-full resize-none overflow-y-auto custom-scrollbar h-10 max-h-24 px-3 py-2 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CTextarea;
