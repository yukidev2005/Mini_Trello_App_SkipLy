import z from 'zod'

export const githubAttachSchema = z.object({
  type: z.string(),
  number: z.string()
})

export type GithubAttachType = z.infer<typeof githubAttachSchema>
