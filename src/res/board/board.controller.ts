import { NextFunction, Request, Response } from 'express'
import { createBoardSchema, updateBoar5dSchema } from './board.schema'
import { getBoardById, handleCreateBoard, handleDeleteBoard, handleUpdateBoard, hanldeGetBoards } from './board.service'

export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { success, error } = createBoardSchema.safeParse(req.body)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleCreateBoard(req.body)

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

export const getBoards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await hanldeGetBoards()

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

export const getBoardbyId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = await getBoardById(id)

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

export const updateBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const payload = req.body

    const { success, error } = updateBoar5dSchema.safeParse(payload)

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleUpdateBoard(id, payload)

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

export const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = await handleDeleteBoard(id)

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
