import { NextFunction, Request, Response } from 'express'
import { emailVerificationSchema, signinSchema, signupSchema } from '~/res/auth/auth.schema'
import { handleSignIn, handleSignUp, handleSendVerifyCode } from '~/res/auth/auth.service'

export const signinController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credential = req.body

    const { success, error } = signinSchema.safeParse(credential)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleSignIn(credential)
    return res.status(200).json({
      message: 'Success',
      data,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    })
  } catch (error: unknown) {
    return next(error)
  }
}

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credential = req.body

    const { success, error } = signupSchema.safeParse(credential)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleSignUp(credential)
    return res.status(201).json({
      message: 'Success',
      data,
      statusCode: 201,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    })
  } catch (error: unknown) {
    return next(error)
  }
}

export const sendVerifyCodeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body

    const { success, error } = emailVerificationSchema.safeParse(email)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleSendVerifyCode(email)

    return res.status(200).json({
      message: 'Success',
      data,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    })
  } catch (error: unknown) {
    return next(error)
  }
}
