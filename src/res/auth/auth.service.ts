import { db } from '~/index'
import { ISigninInterface, ISignUpInterface } from '~/res/auth/auto.interface'
import jwt from 'jsonwebtoken'
import { transporter } from '~/utils/transporter'
import { otpEmailTemplate } from '~/utils/email-template'
import { OTP_EXPIRES_MINUTES } from '~/constants'
import { generateOtp } from '~/utils'

export const handleSignIn = async (credential: ISigninInterface) => {
  const secretKey = process.env.JWT_SECRETKEY

  if (!secretKey) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('System error: JWT_SECRET is not configured')
    error.statusCode = 500
    throw error
  }

  const users = await db.collection('users').where('email', '==', credential.email).get()

  if (users.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Invalid email or verification code')
    error.statusCode = 404
    throw error
  }

  const userDoc = users.docs[0]
  const userData = userDoc.data()

  if (!userData.verificationCode || userData.verificationCode !== credential.verificationCode) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Invalid email or verification code')
    error.statusCode = 401
    throw error
  }

  if (userData.codeExpiresAt) {
    const now = Math.floor(Date.now() / 1000)
    // console.log(new Date(userData.codeExpiresAt).getTime(), now)
    console.log(userData.codeExpiresAt)
    if (userData.codeExpiresAt._seconds < now) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error: any = new Error('Verification code has expired')
      error.statusCode = 401
      throw error
    }
  }

  const accessToken = jwt.sign({ email: credential.email, userId: userDoc.id }, secretKey, { expiresIn: '7d' })

  await db.collection('users').doc(userDoc.id).update({
    verificationCode: null,
    codeExpiresAt: null,
    accessToken
  })

  return { accessToken, email: credential.email, userId: userData.id }
}

export const handleSignUp = async (credential: ISignUpInterface): Promise<{ email: string; id: string }> => {
  const users = await db.collection('users').where('email', '==', credential.email).get()

  if (!users.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('User already exists with this email')
    error.statusCode = 409
    throw error
  }

  const otp = generateOtp()
  const codeExpiresAt = new Date().getTime() + OTP_EXPIRES_MINUTES * 60

  await transporter.sendMail({
    from: `"Skipli Team" <${process.env.GMAIL_USER}>`,
    to: credential.email,
    subject: 'Mã xác thực OTP của bạn',
    html: otpEmailTemplate(otp)
  })

  const user = await db.collection('users').add({
    email: credential.email,
    verificationCode: otp,
    codeExpiresAt,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return {
    email: credential.email,
    id: user.id
  }
}

export const hanldeSentVerifyCode = async (email: string) => {
  const users = await db.collection('users').where('email', '==', email).get()

  if (users.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Not have any user link to this email')
    error.statusCode = 404
    throw error
  }

  const otp = generateOtp()
  const codeExpiresAt = new Date().getTime() + OTP_EXPIRES_MINUTES * 60 * 1000

  await transporter.sendMail({
    from: `"Skipli Team" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'You OTP code',
    html: otpEmailTemplate(otp)
  })

  const userDoc = users.docs[0]
  await db.collection('users').doc(userDoc.id).update({
    verificationCode: otp,
    codeExpiresAt: codeExpiresAt
  })

  console.log('done!')

  return {
    message: 'Verify code has sent to you email'
  }
}
