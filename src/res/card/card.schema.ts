import z from 'zod'

export const createCardSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1)
})

export const updateCardSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1)
})

export type CreateCardType = z.infer<typeof createCardSchema>
export type UpdateCardType = z.infer<typeof updateCardSchema>
