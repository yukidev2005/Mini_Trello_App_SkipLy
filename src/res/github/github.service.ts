import axios, { AxiosRequestConfig } from 'axios'
import { GithubAttachType } from './github.schema'
import { db } from '~/index'

export const handleGetGithubInfoByRepo = async (repositoryId: string, githubAccessToken: string) => {
  const [owner, ...repo] = repositoryId.split('_')
  const formatRepo = repo.join('_')

  const headers: AxiosRequestConfig['headers'] = {
    Authorization: `${githubAccessToken}`,
    Accept: 'application/vnd.github+json'
  }

  const [branches, commits, pulls, issues] = await Promise.all([
    axios.get(`https://api.github.com/repos/${owner}/${formatRepo}/branches`, { headers }),
    axios.get(`https://api.github.com/repos/${owner}/${formatRepo}/commits`, { headers }),
    axios.get(`https://api.github.com/repos/${owner}/${formatRepo}/pulls`, { headers }),
    axios.get(`https://api.github.com/repos/${owner}/${formatRepo}/issues`, { headers })
  ])

  const formatBranches = branches.data.map((b: any) => {
    return {
      name: b.name,
      lastCommitSha: b.commit.sha
    }
  })

  const formatPulls = pulls.data.map((p: any) => {
    return {
      name: p.name,
      pullNumber: p.pullNumber
    }
  })

  const formatCommits = commits.data.map((c: any) => {
    return {
      name: c.sha,
      message: c.commit.message
    }
  })

  const formatIssues = issues.data.map((i: any) => {
    return {
      title: i.title,
      issueNumber: i.issueNumber
    }
  })

  return {
    repositoryId: formatRepo,
    branches: formatBranches,
    pulls: formatPulls,
    commits: formatCommits,
    issues: formatIssues
  }
}

export const handelGithubAttach = async (taskId: string, payloa: GithubAttachType) => {
  // check task

  const task = await db.collection('tasks').doc(taskId).get()
  if (!task.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Task not found')
    error.statusCode = 404
    throw error
  }

  // check  Attach already
  const attachs = await db.collection('attachs').where('task_id', '==', taskId).get()

  if (!attachs.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('attach already exit')
    error.statusCode = 409
    throw error
  }

  // Attach

  const data = await db.collection('attachs').add({
    type: payloa.type,
    number: payloa.number,
    task_id: taskId
  })

  return {
    ...(await data.get()).data()
  }
}

export const handleDeleteGithubAttach = async (taskId: string) => {
  // check task

  const task = await db.collection('tasks').doc(taskId).get()
  if (!task.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Task not found')
    error.statusCode = 404
    throw error
  }

  const attach = await db.collection('attachs').where('tasd_id', '==', taskId).get()

  if (attach.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Attach not found')
    error.statusCode = 404
    throw error
  }

  await db.collection('attachs').doc(attach.docs[1].data().id).delete()

  return null
}
