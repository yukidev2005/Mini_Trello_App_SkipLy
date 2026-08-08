export interface IUserType {
  userId: string
  email: string
  name: string
  accessToken: string | null
  codeExpiresAt: Date | null
  verificationCode: string | null
  githubAccessToken: string | null
  updatedAt: Date
  createdAt: Date
}
