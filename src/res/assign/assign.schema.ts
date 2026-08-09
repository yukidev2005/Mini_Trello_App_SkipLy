import z from 'zod'

export const assignSchema = z.object({
  memberId: z.string(),
  userId: z.string(),
  taskId: z.string()
})

export type AssignType = z.infer<typeof assignSchema>
