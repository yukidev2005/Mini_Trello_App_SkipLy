import axios from 'axios'

export const handleGetGithubInfoByRepo = async (repositoryId: string, githubAccessToken: string) => {
  const [owner, ...repo] = repositoryId.split('_')

  const formatRepo = repo.join('_')

  if (!owner || !repo) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Roep of onwer not found')
    error.statusCode = 404
  }

  const headers = {
    Authorization: `token ${githubAccessToken}`
  }

  const [branchesRes, pullsRes, issuesRes, commitsRes] = await Promise.all([
    axios.get(`https://api.github.com/repos/${owner}/${formatRepo}/branches`, { headers }),
    axios.get(`https://api.github.com/repos/${owner}/${formatRepo}/pulls`, { headers }),
    axios.get(`https://api.github.com/repos/${owner}/${formatRepo}/issues`, { headers }),
    axios.get(`https://api.github.com/repos/${owner}/${formatRepo}/commits`, { headers })
  ])

  const branches = branchesRes.data.map((branche: any) => ({
    name: branche.name,
    lastCommitSha: branche.commit.sha
  }))

  const pulls = pullsRes.data.map((pull: any) => ({
    title: pull.title,
    pullNumber: String(pull.number)
  }))

  const issues = issuesRes.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((issue: any) => !issue.pull_request)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((issue: any) => ({
      title: issue.title,
      issueNumber: String(issue.number)
    }))

  const commits = commitsRes.data.map((commit: any) => ({
    sha: commit.sha,
    message: commit.commit.message
  }))

  return {
    repositoryId,
    branches,
    pulls,
    issues,
    commits
  }
}
