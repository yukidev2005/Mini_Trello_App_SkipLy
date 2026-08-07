import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authorization = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const secretKey = process.env.JWT_SECRETKEY
  const authCode = process.env.AUTH_CODE

  if (!authHeader) {
    return next({
      statusCode: 401,
      message: 'Missing Authorization header'
    })
  }

  if (!secretKey) {
    return next({
      statusCode: 401,
      message: 'JWT secret key not found'
    })
  }

  const parts = authHeader.split(' ')

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next({
      statusCode: 401,
      message: 'Invalid token format'
    })
  }

  const token = parts[1]

  const payload = jwt.verify(token, secretKey) as jwt.JwtPayload

  if (payload.authCode !== authCode) {
    return next({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  return next()
}
