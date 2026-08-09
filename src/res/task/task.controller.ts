import { NextFunction, Request, Response } from 'express'
import { createTaskSchema, updateTaskSchema } from '~/res/task/task.schema'
import { handleCreateTask, handleDeleteTask, handleGetTaskById, handleGetTasks, handleUpdateTask } from '~/res/task/task.service'

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId, cardId } = req.params

    const data = await handleGetTasks(boardId, cardId)

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

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params

    const data = await handleGetTaskById(taskId)

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

    return res.status(201).json({
      message: 'Success',
      data,
      statusCode: 201,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    })
  } catch (error: unknown) {
    return next(error)
  }
}

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  const { boardId, cardId, taskId } = req.params
  const { userId } = req.body

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
      taskId,
      userId
    )

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

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params
  const { userId } = req.body

  try {
    await handleDeleteTask(taskId, userId)

    return res.status(204).send()
  } catch (error: unknown) {
    return next(error)
  }
}
