import { Timestamp } from 'firebase-admin/firestore'

export interface User {
  id?: string
  email: string
  name?: string | null
  avatarUrl?: string | null
  verificationCode?: string | null
  codeExpiresAt?: Timestamp | Date | null
  githubId?: string | null
  githubAccessToken?: string | null
  createdAt: Timestamp | Date
  updatedAt?: Timestamp | Date
}
