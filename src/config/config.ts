import {readFile, readdir} from 'fs'
import {promisify} from 'util'
import merge from 'deepmerge'
import clone from 'lodash.clone'
import YAML from 'yaml'

import {Protection, Specification} from './types'
import * as util from '../util'
import {BranchProtectionRule} from '../API/__generated__/BranchProtectionRule'

const awaitableReadFile = promisify(readFile)
const awaitableReadDir = promisify(readdir)

export async function load(path?: string): Promise<Specification> {
  let target: null | string = ''

  if (typeof path === 'string' && path.length > 0) {
    target = path
  } else {
    const wellKnown = await determineWellKnownPath()
    if (wellKnown) {
      target = wellKnown
    }
  }

  if (target.length === 0) {
    throw new Error('unable to determine configuration path')
  }

  const content = await awaitableReadFile(target, {encoding: 'utf-8'})
  const config: Specification = YAML.parse(content)
  return config
}

const wellKnownLocations = [
  'protector.yml',
  'protector.yaml',
  'branch_protection.yml',
  'branch_protection.yaml',
  'protection.yml',
  'protection.yaml'
]

async function determineWellKnownPath(): Promise<null | string> {
  const directory = await awaitableReadDir('.github/')
  const file = wellKnownLocations.find(location => directory.includes(location))

  if (!file) {
    return null
  }

  return `./.github/${file}`
}

/**
 * Translates the given BranchProtectionRule to an internal Protection.
 */
export function translate(
  rule: null | BranchProtectionRule
): null | Protection {
  if (!rule) {
    return null
  }

  const {
    reviewDismissalAllowances,
    pushAllowances,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __typename,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pattern,
    ...rest
  } = rule

  return {
    ...rest,
    requiredStatusCheckContexts: rest.requiredStatusCheckContexts
      ? clone(rest.requiredStatusCheckContexts)
      : [],
    reviewDismissalActors: (reviewDismissalAllowances.edges || [])
      .reduce((accumulator, edge) => {
        const actor = edge?.node?.actor
        if (actor?.__typename === 'User') {
          return [...accumulator, `@${actor.userHandle}`]
        } else if (actor?.__typename === 'Team') {
          return [...accumulator, `#${actor.teamHandle}`]
        }

        return accumulator
      }, [] as string[])
      .filter(util.filterUnique),
    pushActors: (pushAllowances.edges || [])
      .reduce((accumulator, edge) => {
        const actor = edge?.node?.actor

        if (actor?.__typename === 'User') {
          return [...accumulator, `@${actor.userHandle}`]
        } else if (actor?.__typename === 'Team') {
          return [...accumulator, `#${actor.teamHandle}`]
        }

        return accumulator
      }, [] as string[])
      .filter(util.filterUnique)
  }
}

/**
 * Determines the actual `Specification` for the passed `search` `Pattern`.
 *
 * @param specification
 * @param search
 */
export function extractByPattern(
  {patterns, overrides, ...rest}: Specification,
  search: string
): null | Protection {
  if (!(patterns || []).includes(search)) {
    return null
  }

  const matched = merge(rest, (overrides || {})[search])

  if (matched.pushActors) {
    matched.pushActors = matched.pushActors.filter(util.filterUnique)
  }

  if (matched.reviewDismissalActors) {
    matched.reviewDismissalActors = matched.reviewDismissalActors.filter(
      util.filterUnique
    )
  }

  if (matched.requiredStatusCheckContexts) {
    matched.requiredStatusCheckContexts =
      matched.requiredStatusCheckContexts?.filter(util.filterUnique) || []
  }

  return Object.freeze(matched)
}

const defaultSpecification: Protection = {
  requiredApprovingReviewCount: 1,
  allowsDeletions: false,
  allowsForcePushes: false,
  dismissesStaleReviews: false,
  isAdminEnforced: false,
  requiresApprovingReviews: false,
  requiresCodeOwnerReviews: false,
  requiresCommitSignatures: false,
  requiresLinearHistory: false,
  requiresStatusChecks: false,
  restrictsPushes: false,
  restrictsReviewDismissals: false,
  requiresStrictStatusChecks: false,
  requiredStatusCheckContexts: [],
  reviewDismissalActors: [],
  pushActors: []
}

function isEqual(current: unknown, desired: unknown): boolean {
  if (Array.isArray(current) && Array.isArray(desired)) {
    return desired.every(value => current.includes(value))
  }

  if (current === desired) {
    return true
  }

  return false
}

export function diff(
  current: Partial<Protection>,
  desired: Partial<Protection>
): null | Protection {
  const keys = [
    ...(Object.keys(current) as (keyof Protection)[]),
    ...(Object.keys(desired) as (keyof Protection)[])
  ].filter((value, index, self) => self.indexOf(value) === index)

  const result = keys.reduce((accumulator, key) => {
    if (key in desired) {
      if (key in current && isEqual(current[key], desired[key])) {
        return accumulator
      }

      return {...accumulator, [key]: desired[key]}
    }

    if (!(key in desired) && key in current) {
      return {...accumulator, [key]: clone(defaultSpecification[key])}
    }

    return accumulator
  }, {} as Protection)

  if (Object.keys(result).length === 0) {
    return null
  }

  return result
}
