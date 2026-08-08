import { NextFunction, Request, Response } from 'express'
import { handleGetGithubInfoByRepo } from '~/res/github/github.service'

export const getGithubInfoByRepo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { repositoryId } = req.params

    const githubToken = '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'

    const { branches, pulls, issues, commits } = await handleGetGithubInfoByRepo(repositoryId, githubToken)

    return res.status(200).json({
      repositoryId,
      branches,
      pulls,
      issues,
      commits
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next({
      statusCode: error.statusCode,
      message: error.message
    })
  }
}
