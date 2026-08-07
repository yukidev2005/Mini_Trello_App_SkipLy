import { NextFunction, Request, Response } from 'express'
import { emailVerificationSchema, signinSchema, signupSchema } from '~/res/auth/auth.schema'
import { handleSignIn, handleSignUp, hanldeSentVerifyCode } from '~/res/auth/auth.service'

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next({
      statusCode: error.statusCode,
      message: error.message
    })
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next({
      statusCode: error.statusCode,
      message: error.message
    })
  }
}

export const sentVerifyCodeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body

    const { success, error } = emailVerificationSchema.safeParse(email)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await hanldeSentVerifyCode(email)

    return res.status(200).json({
      message: 'Success',
      data,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next({
      statusCode: error.statusCode,
      message: error.message
    })
  }
}
