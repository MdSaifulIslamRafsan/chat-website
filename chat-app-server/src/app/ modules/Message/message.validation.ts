import z from "zod";

const createMessageSchema = z.object({
  body: z.object({
    sender: z.string().nonempty("Sender ID is required"),
    text: z.string().nonempty("Message text is required"),
    conversationId: z.string().nonempty("Conversation ID is required"),
    attachments: z
      .array(z.string().url("Attachment must be a valid URL"))
      .optional(),
  }),
});

export const messageValidation = {
  createMessageSchema,
};
