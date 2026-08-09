import { NextFunction, Request, Response } from 'express'
import { sendInviteSchema, respondInviteSchema } from './invite.schema'
import { handleSendInvite, handleRespondInvite } from './invite.service'

export const sendInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId } = req.params

    const { success, error } = sendInviteSchema.safeParse(req.body)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleSendInvite(boardId, req.body)

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

export const respondInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId, cardId } = req.params

    const { success, error } = respondInviteSchema.safeParse(req.body)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleRespondInvite(boardId, cardId, req.body)

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
