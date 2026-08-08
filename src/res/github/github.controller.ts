import { NextFunction, Request, Response } from 'express'
import { handelGithubAttach, handleDeleteGithubAttach, handleGetGithubInfoByRepo } from './github.service'
import { githubAttachSchema } from './github.schema'

export const getGithubInfoByRepo = async (req: Request, res: Response, next: NextFunction) => {
  const { repositoryId } = req.params
  const { authorization } = req.headers

  if (!authorization) {
    return next({
      statusCode: 401,
      message: 'github Token is requred'
    })
  }

  try {
    const data = await handleGetGithubInfoByRepo(repositoryId, authorization as string)
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

export const githubAttach = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params

    const { success, error } = githubAttachSchema.safeParse(req.body)

    if (!success) {
      return next({
        statusCode: 400,
        message: error.issues
      })
    }

    const data = await handelGithubAttach(taskId, req.body)

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

export const deleteGithubAttach = async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params

  try {
    await handleDeleteGithubAttach(taskId)

    return res.status(201)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next({
      statusCode: error.statusCode,
      message: error.message
    })
  }
}
