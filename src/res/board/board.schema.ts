import z from 'zod'

export const createBoardSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  userId: z.string()
})

export const updateBoar5dSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  userId: z.string()
})

export type CreateBoardType = z.infer<typeof createBoardSchema>
export type UpdateBoardType = z.infer<typeof updateBoar5dSchema>
