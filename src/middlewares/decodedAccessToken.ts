import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const decodedAccessToken = (req : Request , res :Response ,.next :NextFunction) => {
  const secretKey = process.env.JWT_SECRETKEY
  const accessToken = req.headers.accessToken

  if (!secretKey) {
    return next({
      statusCode: 401,
      message: 'JWT secret key not found'
    })
  }

  if(!accessToken) {
     return next({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const  userData = jwt.verify(accessToken,secretKey)
}
