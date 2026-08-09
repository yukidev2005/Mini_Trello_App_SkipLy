import { NextFunction, Request, Response } from 'express'
import { createBoardSchema, updateBoar5dSchema } from './board.schema'
import {
  getBoardById,
  handleCreateBoard,
  handleDeleteBoard,
  handleGetMembersByBoardId,
  handleUpdateBoard,
  hanldeGetBoards
} from './board.service'
import { sendInviteSchema } from '../invite/invite.schema'
import { handleSendInvite } from '../invite/invite.service'

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
    const id = req.params.id || req.params.boardId
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

export const getMembersByBoardId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boardId = req.params.boardId || req.params.id
    const data = await handleGetMembersByBoardId(boardId)

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
    const { userId } = req.body
    const data = await handleDeleteBoard(id, userId)

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

export const sendInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boardId = req.params.boardId || req.params.id

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
