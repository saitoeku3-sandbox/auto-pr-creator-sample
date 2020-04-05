type Env = {
  GITHUB_OWNER: string
  GITHUB_REPO: string
  GITHUB_TOKEN: string
}

export const env: Env = {
  GITHUB_OWNER: process.env.GITHUB_OWNER || '',
  GITHUB_REPO: process.env.GITHUB_REPO || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
}
