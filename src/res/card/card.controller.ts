import { NextFunction, Request, Response } from 'express'
import {
  handleCreateCard,
  handleDeleteCard,
  handleGetCardById,
  handleGetCardsByUserId,
  handleGetMembersByCardId,
  handleUpdateCard,
  hanldeGetCards
} from './card.service'
import { createCardSchema, updateCardSchema } from './card.schema'

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId } = req.params

    const { success, error } = createCardSchema.safeParse(req.body)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleCreateCard(req.body, boardId)

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

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId } = req.params

    const data = await hanldeGetCards(boardId)

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

export const getCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId, boardId } = req.params
    const data = await handleGetCardById(cardId, boardId)

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

export const getCardsByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params

    const data = await handleGetCardsByUserId(userId)

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

export const getMembersByCardId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId, boardId } = req.params

    const data = await handleGetMembersByCardId(cardId, boardId)

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
      statusCode: error.statusCode || 500,
      message: error.message
    })
  }
}

export const updateCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params
    const payload = req.body

    const { success, error } = updateCardSchema.safeParse(payload)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleUpdateCard(cardId, payload)

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

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params
    const { userId } = req.body
    const data = await handleDeleteCard(cardId, userId)

    return res.status(204).json({
      message: 'Success',
      data,
      statusCode: 204,
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
