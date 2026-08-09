import { NextFunction, Request, Response } from 'express'
import { assignSchema } from '~/res/assign/assign.schema'
import { handleAssign, handleDeleteAssign, handleGetAssignInCard } from '~/res/assign/assign.service'

export const assignMemberToTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params
    const { userId, memberId } = req.body

    const { success, error } = assignSchema.safeParse({
      taskId,
      ...req.body
    })

    if (!success) {
      return next({ message: error.issues, statusCode: 400 })
    }

    const data = await handleAssign({ taskId, userId, memberId })

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

export const getAssignInCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params

    const data = await handleGetAssignInCard(taskId)

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

export const deleteAssign = async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params
  const { memberId, ownerId } = req.body

  try {
    await handleDeleteAssign({ memberId, ownerId, taskId })

    return res.status(204).send()
  } catch (error: unknown) {
    return next(error)
  }
}
