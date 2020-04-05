type Env = {
  GITHUB_OWNER: string
  GITHUB_REPO: string
  GITHUB_TOKEN: string
  NODE_ENV: 'production' | 'development'
  HOST: string
  PORT: number
}

export const env: Env = {
  GITHUB_OWNER: process.env.GITHUB_OWNER || '',
  GITHUB_REPO: process.env.GITHUB_REPO || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  NODE_ENV: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: Number(process.env.PORT) || 3000,
}
