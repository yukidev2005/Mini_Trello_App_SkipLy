import z from 'zod'

export const sendInviteSchema = z
  .object({
    email: z.string().email({ message: 'Email không đúng định dạng' }).optional(),
    email_member: z.string().email({ message: 'Email không đúng định dạng' }).optional(),
    board_owner_id: z.string().optional(),
    member_id: z.string().optional()
  })
  .refine((data) => Boolean(data.email || data.email_member), {
    message: 'Vui lòng nhập email',
    path: ['email']
  })

export const respondInviteSchema = z.object({
  invite_id: z.string().min(1),
  card_id: z.string().min(1),
  member_id: z.string().min(1),
  status: z.enum(['accepted', 'declined'])
})

export type SendInviteType = z.infer<typeof sendInviteSchema>
export type RespondInviteType = z.infer<typeof respondInviteSchema>
