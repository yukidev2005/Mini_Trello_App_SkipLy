import { Request, Response, NextFunction } from 'express'

type CustomError = {
  message: string
  statusCode?: number
}

const statusCodeMessages: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  404: 'Not Found',
  409: 'Conflict',
  403: 'Forbidden'
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log('errorHandler :', err)

  const code = err.statusCode ?? 500
  return res.status(code).json({
    message: err.message,
    error: statusCodeMessages[code] || 'Internal Server Error',
    statusCode: code,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  })
}
