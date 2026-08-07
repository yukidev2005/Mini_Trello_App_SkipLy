import z from 'zod'

export const createTaskSchema = z.object({
  boardId: z.string(),
  cardId: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
  ownerId: z.string()
})
export const updateTaskSchema = z.object({
  boardId: z.string(),
  cardId: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string()
})

export type CreateTaskType = z.infer<typeof createTaskSchema>
export type UpdateTaskType = z.infer<typeof updateTaskSchema>
