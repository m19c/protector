import * as core from '@actions/core'

export const branch = (process.env.GITHUB_REF || '')
  .split('/')
  .slice(2)
  .join('/')
  .trim()

export const token = core.getInput('token') || process.env.GITHUB_TOKEN

export const [owner, name] = (process.env.GITHUB_REPOSITORY || '/').split('/')
