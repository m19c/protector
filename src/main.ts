import * as core from '@actions/core'

import * as environment from './environment'
import * as config from './config'
import API from './API'
import {diff, extractByPattern} from './config'

async function run(): Promise<void> {
  try {
    if (
      typeof environment.token !== 'string' ||
      environment.token.length === 0
    ) {
      throw new Error('Valid token required')
    }

    if (environment.branch.length === 0) {
      throw new Error('Unable to determine search pattern')
    }

    if (environment.owner.length === 0 || environment.name.length === 0) {
      throw new Error('Unable to determine the actual repository name')
    }

    const specification = await config.load(core.getInput('config'))

    const api = new API({
      token: environment.token,
      owner: environment.owner,
      name: environment.name
    })

    const repository = await api.findRepository()

    if (!repository) {
      throw new Error(
        `Cannot find repository ${environment.owner}/${environment.name}`
      )
    }

    const branchProtection = api.extractBranchProtectionRuleByPattern(
      repository,
      environment.branch
    )

    const current = config.translate(branchProtection)
    const desired = extractByPattern(specification, environment.branch)

    if (
      !specification.patterns?.includes(environment.branch) &&
      branchProtection !== null
    ) {
      core.info(
        `deleting branch protection rule for ${environment.branch} (${branchProtection.id})`
      )
      await api.deleteBranchProtectionRuleByID(branchProtection.id)
    } else if (
      branchProtection !== null &&
      current !== null &&
      desired !== null
    ) {
      const patch = diff(current, desired)
      if (patch !== null) {
        core.info(
          `updating the branch protection ${
            environment.branch
          } to ${JSON.stringify(patch)}`
        )
        await api.updateBranchProtectionRuleByID(
          repository,
          branchProtection.id,
          patch
        )
      } else {
        core.info(`nothing to change on ${environment.branch}`)
      }
    } else if (current === null && desired !== null) {
      await api.createBranchProtectionRule(
        repository,
        environment.branch,
        desired
      )
      core.info(
        `created a new branch protection for ${
          environment.branch
        } (${JSON.stringify(desired)})`
      )
    }

    core.info('completed')
  } catch (err) {
    if (err instanceof Error) {
      core.error(err.stack || err.message)
    }

    core.setFailed(err.message)
  }
}

run()
