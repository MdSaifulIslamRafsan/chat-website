import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  avatar: z
    .instanceof(File, { message: "Avatar is required" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          file.type
        ),
      "Only JPEG, PNG, and GIF images are allowed"
    ),
  gender: z.string().nonempty("Gender is required"),
  email: z.string().min(1, "Email is required").email("Email must be valid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
