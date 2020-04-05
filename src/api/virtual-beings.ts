import { Octokit } from '@octokit/rest'
import parser from 'csv-parse/lib/sync'
import { Request } from 'express'
import { v4 as uuid } from 'uuid'
import { base64Decode } from '../utils/base64'
import { env } from '../constsnts/env'
import { VirtualBeing } from '../types'

const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = env
const FILE_PATH = 'resource/virtual-beings.csv'
const TITLE = ''
const BODY = ''
const COMMIT_MESSAGE = `update ${FILE_PATH}`
const BASE_BRANCH = 'master'

const octkit = new Octokit({
  auth: GITHUB_TOKEN,
})

export const index = async () => {
  const { data } = await octkit.repos.getContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: FILE_PATH,
  })

  if ('content' in data) {
    const content = base64Decode(data.content || '')
    const [keys, ...values]: string[][] = parser(content)

    const virtualBeings = values.map(
      (value: string[]) =>
        Object.fromEntries(
          keys.map((key, index) => [key, value[index]])
        ) as VirtualBeing
    )

    return virtualBeings
  }
}

export const update = async (req: Request) => {
  const branch = uuid()
  const {
    label,
    youtubeChannelId,
    youtubeChannelName,
    twitterAccount,
    office,
  }: VirtualBeing = req.body

  const { data } = await octkit.repos.getContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: FILE_PATH,
  })

  if (!('content' in data)) return

  const previousContent = data.content || ''
  const file = data.sha

  const row = `${label},${youtubeChannelId},${youtubeChannelName},${twitterAccount},${office}`
  const rows = base64Decode(previousContent).split('\n')
  const index = rows.findIndex((value) => value.startsWith(label))

  if (rows[index] === row) return

  rows[index] = row
  const content = rows.join('\n')

  const {
    data: {
      commit: {
        sha: parent,
        commit: {
          tree: { sha: baseTree },
        },
      },
    },
  } = await octkit.repos.getBranch({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    branch: BASE_BRANCH,
  })

  await octkit.git.getBlob({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    file_sha: file,
  })

  const {
    data: { sha: blob },
  } = await octkit.git.createBlob({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    content,
    encoding: 'utf-8',
  })

  const {
    data: { sha: tree },
  } = await octkit.git.createTree({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    base_tree: baseTree,
    tree: [
      {
        path: FILE_PATH,
        mode: '100644',
        sha: blob,
      },
    ],
  })

  const {
    data: { sha },
  } = await octkit.git.createCommit({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    message: COMMIT_MESSAGE,
    tree,
    parents: [parent],
  })

  await octkit.git.createRef({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    ref: `refs/heads/${branch}`,
    sha,
  })

  await octkit.pulls.create({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    title: TITLE,
    body: BODY,
    head: branch,
    base: BASE_BRANCH,
  })
}
