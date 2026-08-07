import { NextFunction, Request, Response } from 'express'
import { createTaskSchema, updateTaskSchema } from '~/res/task/task.schema'
import {
  handleCreateTask,
  handleDeleteTask,
  handleGetTaskById,
  handleGetTasks,
  handleUpdateTask
} from '~/res/task/task.service'

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId, cardId } = req.params

    const data = await handleGetTasks(boardId, cardId)

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

export const getTasksbyId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params

    const data = await handleGetTaskById(taskId)

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

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  const { boardId, cardId } = req.params

  try {
    const { success, error } = createTaskSchema.safeParse({
      boardId,
      cardId,
      ...req.body
    })

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleCreateTask({
      cardId,
      boardId,
      ...req.body
    })

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

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  const { boardId, cardId, taskId } = req.params

  try {
    const { success, error } = updateTaskSchema.safeParse({
      boardId,
      cardId,
      ...req.body
    })

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleUpdateTask(
      {
        cardId,
        boardId,
        ...req.body
      },
      taskId
    )

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

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params

  try {
    await handleDeleteTask(taskId)

    return res.status(204).json({
      message: 'Success',
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
