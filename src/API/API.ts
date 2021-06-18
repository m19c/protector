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
  GET_BRANCH_PROTECTION_RULE,
  GET_REPOSITORY,
  UPDATE_BRANCH_PROTECTION_RULE
} from './queries'
import {
  GetBranchProtectionRule,
  GetBranchProtectionRuleVariables
} from './__generated__/GetBranchProtectionRule'
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

    if (res.error) {
      throw res.error
    }

    return res.data.repository
  }

  /**
   * Finds a branch protectino by its pattern.
   *
   * At the moment, findBPByPattern just queries the first 100 entities of
   * `branchProtectionRules`.
   *
   * @param pattern
   */
  async findBranchProtectionByPattern(
    pattern: string
  ): Promise<BranchProtectionRule | null> {
    const res = await this.client.query<
      GetBranchProtectionRule,
      GetBranchProtectionRuleVariables
    >({
      query: GET_BRANCH_PROTECTION_RULE,
      variables: {
        owner: this.owner,
        name: this.name
      }
    })

    if (res.error) {
      throw res.error
    }

    return (
      res.data.repository?.branchProtectionRules.edges?.find(
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
    repositoryId: string,
    pattern: string,
    rule: Protection
  ): Promise<BranchProtectionRule> {
    const res = await this.client.mutate<
      CreateBranchProtectionRule,
      CreateBranchProtectionRuleVariables
    >({
      mutation: CREATE_BRANCH_PROTECTION_RULE,
      variables: {
        input: {
          pattern,
          repositoryId,
          ...(rule as Omit<
            CreateBranchProtectionRuleInput,
            'pattern' | 'repositoryId'
          >)
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
    id: string,
    rule: Protection
  ): Promise<BranchProtectionRule> {
    const res = await this.client.mutate<
      UpdateBranchProtectionRule,
      UpdateBranchProtectionRuleVariables
    >({
      mutation: UPDATE_BRANCH_PROTECTION_RULE,
      variables: {
        input: {
          branchProtectionRuleId: id,
          ...(rule as Omit<
            UpdateBranchProtectionRuleInput,
            'branchProtectionRuleId'
          >)
        }
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
}
