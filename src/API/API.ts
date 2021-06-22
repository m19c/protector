import fetch from 'cross-fetch'
import {
  ApolloClient,
  ApolloError,
  HttpLink,
  InMemoryCache
} from '@apollo/client/core'
import {
  CREATE_BRANCH_PROTECTION_RULE,
  DELETE_BRANCH_PROTECTION_RULE,
  GET_ACTOR_TEAM,
  GET_ACTOR_USER,
  GET_REPOSITORY,
  UPDATE_BRANCH_PROTECTION_RULE
} from './queries'
import {
  DeleteBranchProtectionRule,
  DeleteBranchProtectionRuleVariables
} from './__generated__/DeleteBranchProtectionRule'
import {
  UpdateBranchProtectionRule,
  UpdateBranchProtectionRuleVariables
} from './__generated__/UpdateBranchProtectionRule'
import {Protection} from '../config'
import {BranchProtectionRule} from './__generated__/BranchProtectionRule'
import {
  CreateBranchProtectionRule,
  CreateBranchProtectionRuleVariables
} from './__generated__/CreateBranchProtectionRule'
import {
  GetRepository,
  GetRepositoryVariables,
  GetRepository_repository
} from './__generated__/GetRepository'
import {
  CreateBranchProtectionRuleInput,
  UpdateBranchProtectionRuleInput
} from '../global'
import {
  GetActorUser,
  GetActorUserVariables,
  GetActorUser_user
} from './__generated__/GetActorUser'
import {
  GetActorTeam,
  GetActorTeamVariables,
  GetActorTeam_organization_team
} from './__generated__/GetActorTeam'

interface Options {
  /**
   * The GitHub access token used by the graphql client to
   * perform queries.
   */
  token: string

  /**
   * The owner of the repository (e.g. m19c or
   * github).
   */
  owner: string

  /**
   * The actual repository name.
   */
  name: string
}

export default class API {
  private client: ApolloClient<unknown>

  private owner: string
  private name: string

  constructor({token, ...rest}: Options) {
    this.owner = rest.owner
    this.name = rest.name

    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: 'https://api.github.com/graphql',
        fetch,
        headers: {
          authorization: `bearer ${token}`
        }
      })
    })
  }

  async findRepository(): Promise<null | GetRepository_repository> {
    const res = await this.client.query<GetRepository, GetRepositoryVariables>({
      query: GET_REPOSITORY,
      variables: {owner: this.owner, name: this.name}
    })

    if (res.errors) {
      throw new ApolloError({graphQLErrors: res.errors})
    }

    return res.data.repository
  }

  /**
   * Finds a branch protection by its pattern.
   *
   * @param repository
   * @param pattern
   */
  extractBranchProtectionRuleByPattern(
    repository: GetRepository_repository,
    pattern: string
  ): BranchProtectionRule | null {
    return (
      repository?.branchProtectionRules.edges?.find(
        item => item?.node?.pattern === pattern
      )?.node || null
    )
  }

  /**
   * Creates a new branch protection rule.
   *
   * @param repositoryId The unique repository identifier
   * @param pattern The branch protection pattern
   * @param rule The actual ruleset.
   */
  async createBranchProtectionRule(
    repository: GetRepository_repository,
    pattern: string,
    {pushActors, reviewDismissalActors, ...rule}: Partial<Protection>
  ): Promise<BranchProtectionRule> {
    const res = await this.client.mutate<
      CreateBranchProtectionRule,
      CreateBranchProtectionRuleVariables
    >({
      mutation: CREATE_BRANCH_PROTECTION_RULE,
      variables: {
        input: {
          pattern,
          repositoryId: repository.id,
          ...(rule as Omit<
            CreateBranchProtectionRuleInput,
            'pattern' | 'repositoryId'
          >),
          pushActorIds:
            pushActors && pushActors.length > 0
              ? await this.resolveActors(
                  this.getOrganizationHandle(repository),
                  pushActors
                )
              : undefined,
          reviewDismissalActorIds:
            reviewDismissalActors && reviewDismissalActors.length > 0
              ? await this.resolveActors(
                  this.getOrganizationHandle(repository),
                  reviewDismissalActors
                )
              : undefined
        }
      }
    })

    if (res.errors) {
      throw new ApolloError({graphQLErrors: res.errors})
    }

    const branchProtectionRule =
      res.data?.createBranchProtectionRule?.branchProtectionRule || null

    if (!branchProtectionRule) {
      throw new Error('unable to read the branchProtectionRule')
    }

    return branchProtectionRule
  }

  /**
   * Updates a branch protection rule.
   *
   * @param id the unique identifier of the branch protection rule
   * @param spec the new specification
   */
  async updateBranchProtectionRuleByID(
    repository: GetRepository_repository,
    id: string,
    {pushActors, reviewDismissalActors, ...rule}: Partial<Protection>
  ): Promise<BranchProtectionRule> {
    const input: UpdateBranchProtectionRuleInput = {
      branchProtectionRuleId: id,
      ...(rule as Omit<
        UpdateBranchProtectionRuleInput,
        'branchProtectionRuleId'
      >)
    }

    if (pushActors && pushActors.length > 0) {
      input.pushActorIds = await this.resolveActors(
        this.getOrganizationHandle(repository),
        pushActors
      )
    }

    if (reviewDismissalActors && reviewDismissalActors.length > 0) {
      input.reviewDismissalActorIds = await this.resolveActors(
        this.getOrganizationHandle(repository),
        reviewDismissalActors
      )
    }

    const res = await this.client.mutate<
      UpdateBranchProtectionRule,
      UpdateBranchProtectionRuleVariables
    >({
      mutation: UPDATE_BRANCH_PROTECTION_RULE,
      variables: {
        input
      }
    })

    if (res.errors) {
      throw new ApolloError({graphQLErrors: res.errors})
    }

    const branchProtectionRule =
      res.data?.updateBranchProtectionRule?.branchProtectionRule || null

    if (!branchProtectionRule) {
      throw new Error('unable to read the branchProtectionRule')
    }

    return branchProtectionRule
  }

  /**
   * Deletes a branch protection.
   *
   * @param id the unique identifier of the branch protection rule
   */
  async deleteBranchProtectionRuleByID(id: string): Promise<boolean> {
    const res = await this.client.mutate<
      DeleteBranchProtectionRule,
      DeleteBranchProtectionRuleVariables
    >({
      mutation: DELETE_BRANCH_PROTECTION_RULE,
      variables: {
        id
      }
    })

    if (res.errors) {
      throw new ApolloError({graphQLErrors: res.errors})
    }

    return true
  }

  async findActorUser(handle: string): Promise<null | GetActorUser_user> {
    const res = await this.client.query<GetActorUser, GetActorUserVariables>({
      query: GET_ACTOR_USER,
      variables: {handle}
    })

    if (res.errors) {
      throw new ApolloError({graphQLErrors: res.errors})
    }

    return res.data.user || null
  }

  async findActorTeam(
    handle: string,
    slug: string
  ): Promise<null | GetActorTeam_organization_team> {
    const res = await this.client.query<GetActorTeam, GetActorTeamVariables>({
      query: GET_ACTOR_TEAM,
      variables: {handle, slug}
    })

    if (res.errors) {
      throw new ApolloError({graphQLErrors: res.errors})
    }

    return res.data.organization?.team || null
  }

  async resolveActors(
    organization: null | string,
    actors: string[]
  ): Promise<string[]> {
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    const queries = actors.map(actor => {
      if (actor.startsWith('@')) {
        // eslint-disable-next-line github/no-then
        return this.findActorUser(actor.substr(1)).then(maybeUser => {
          if (maybeUser) {
            return maybeUser.id
          }

          return Promise.reject(new Error(`unable to find actor ${actor}`))
        })
      }

      if (actor.startsWith('#')) {
        if (organization !== null) {
          // eslint-disable-next-line github/no-then
          return this.findActorTeam(organization, actor.substr(1)).then(
            maybeTeam => {
              if (maybeTeam) {
                return maybeTeam.id
              }

              return Promise.reject(new Error(`unable to find actor ${actor}`))
            }
          )
        }

        return Promise.reject(
          new Error(
            `Unable to query teams outside of an orgnaization (${actor.substr(
              1
            )})`
          )
        )
      }

      return Promise.reject(new Error(`Invalid actor ${actor} obtained`))
    })

    return Promise.all(queries)
  }

  private getOrganizationHandle(
    repository: GetRepository_repository
  ): null | string {
    if (repository.owner.__typename === 'Organization') {
      return repository.owner.organizationHandle
    }

    return null
  }
}
