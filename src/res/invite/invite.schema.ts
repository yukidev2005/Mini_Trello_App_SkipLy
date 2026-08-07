import z from 'zod'

export const sendInviteSchema = z.object({
  board_owner_id: z.string().min(1),
  member_id: z.string().min(1),
  email_member: z.email({ message: 'Email không đúng định dạng' }).optional()
})

export const respondInviteSchema = z.object({
  invite_id: z.string().min(1),
  card_id: z.string().min(1),
  member_id: z.string().min(1),
  status: z.enum(['accepted', 'declined'])
})

export type SendInviteType = z.infer<typeof sendInviteSchema>
export type RespondInviteType = z.infer<typeof respondInviteSchema>
