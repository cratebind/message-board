import * as z from "zod"

export const SignupInput = z.object({
  username: z.string(),
  password: z.string().min(10).max(100),
})
export type SignupInputType = z.infer<typeof SignupInput>

export const LoginInput = z.object({
  username: z.string(),
  password: z.string(),
})
export type LoginInputType = z.infer<typeof LoginInput>
