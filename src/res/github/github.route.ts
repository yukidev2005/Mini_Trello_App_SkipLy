import { Router } from 'express'
import { getGithubInfoByRepo } from './github.controller'

export const githubRoute = Router()

githubRoute.get('/:repositoryId/github-info', getGithubInfoByRepo)
