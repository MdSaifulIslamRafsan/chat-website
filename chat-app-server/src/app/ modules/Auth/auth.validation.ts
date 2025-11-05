import { z } from "zod";

const loginUserValidation = z.object({
  body: z.object({
    email: z.string().nonempty("Email is required").email("Invalid email format"),
    password: z.string().nonempty("Password is required"),
  }),
});

const refreshTokenValidation = z.object({
  body: z.object({
  cookies: z.object({
    refreshToken: z.string().nonempty("Refresh Token is required"),
  }),
  }),
    
});

export const AuthValidation = {
  loginUserValidation,
  refreshTokenValidation,
};
