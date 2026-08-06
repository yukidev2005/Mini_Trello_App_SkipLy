import z from 'zod'

export const signinSchema = z.object({
  email: z.email({ message: 'Email không đúng định dạng' }),
  verificationCode: z
    .string()
    .min(6, { message: 'Mã OTP phải đủ 6 ký tự' })
    .max(6, { message: 'Mã OTP tối đa 6 ký tự' })
})

export const signupSchema = z.object({
  email: z.email({ message: 'Email không đúng định dạng' })
})

export const emailVerificationSchema = z.email({ message: 'Email không đúng định dạng' })

export const validateOTPSchema = z.object({
  email: z.email({ message: 'Email không đúng định dạng' }),
  verificationCode: z
    .string()
    .min(6, { message: 'Mã OTP phải đủ 6 ký tự' })
    .max(6, { message: 'Mã OTP tối đa 6 ký tự' })
})

export type SigninType = z.infer<typeof signinSchema>
export type SignupType = z.infer<typeof signupSchema>
export type EmailVerificationType = z.infer<typeof emailVerificationSchema>
export type ValidationOTPType = z.infer<typeof validateOTPSchema>
