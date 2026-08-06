import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const jwtGraud = async (req: Request, res: Response, next: NextFunction) => {
  const secretKey = process.env.JWT_SECRET

  if (!secretKey) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('System error: JWT_SECRET is not configured')
    error.statusCode = 500
    throw error
  }

  const { headers } = req
  const authorizationToken = headers.authorization
  try {
    if (!authorizationToken) {
      return next({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    const isValid = jwt.verify(authorizationToken, secretKey)

    if (!isValid) {
      return next({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    return next()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next({
      statusCode: error.statusCode,
      message: error.message
    })
  }
}
