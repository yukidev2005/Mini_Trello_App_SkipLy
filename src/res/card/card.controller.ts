import { NextFunction, Request, Response } from 'express'
import { handleCreateCard, handleDeleteCard, handleGetCardById, handleUpdateCard, hanldeGetCards } from './card.service'
import { createCardSchema, updateCardSchema } from './card.schema'

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { success, error } = createCardSchema.safeParse(req.body)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleCreateCard(req.body)

    return res.status(200).json({
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
    const data = await hanldeGetCards()

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
    const { id } = req.params
    const data = await handleGetCardById(id)

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

export const updateCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const payload = req.body

    const { success, error } = updateCardSchema.safeParse(payload)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleUpdateCard(id, payload)

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
    const { id } = req.params
    const data = await handleDeleteCard(id)

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
