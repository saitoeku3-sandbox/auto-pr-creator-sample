import { Octokit } from '@octokit/rest'
import { Request } from 'express'
import { v4 as uuid } from 'uuid'
import { env } from '~/constants/env'
import { TTL } from '~/lib/ttl'
import { VirtualBeing } from '~/types'
import { base64Decode } from '~/utils/base64'

const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = env
const FILE_PATH = 'data/virtual-beings.ttl'
const TITLE = `update ${FILE_PATH}`
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
    const ttl = new TTL(content)
    return ttl.findAll()
  }

  return []
}

export const update = async (req: Request) => {
  const branch = uuid()
  const params: VirtualBeing = req.body

  const { data } = await octkit.repos.getContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: FILE_PATH,
  })

  if (!('content' in data)) return

  const file = data.sha

  const ttl = new TTL<VirtualBeing>(base64Decode(data.content || ''))
  const virtualBeing = ttl.find(params.label)
  ttl.update(virtualBeing, params)
  const content = await ttl.read()

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
