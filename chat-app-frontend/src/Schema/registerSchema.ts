import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  gender: z.string().nonempty("Gender is required"),
  email: z.string().min(1, "Email is required").email("Email must be valid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
