import {gql} from '@apollo/client/core'

export const BranchProtectionRule = gql`
  fragment BranchProtectionRule on BranchProtectionRule {
    id
    pattern

    allowsDeletions
    allowsForcePushes
    dismissesStaleReviews
    isAdminEnforced
    requiredApprovingReviewCount
    requiresApprovingReviews
    requiresCodeOwnerReviews
    requiresCommitSignatures
    requiresLinearHistory
    restrictsReviewDismissals
    restrictsPushes
    requiredStatusCheckContexts
    requiresStatusChecks
    requiresStrictStatusChecks
    reviewDismissalAllowances(first: 100) {
      edges {
        node {
          id
          actor {
            ... on User {
              userHandle: login
            }
            ... on Team {
              teamHandle: slug
            }
          }
        }
      }
    }
    pushAllowances(first: 100) {
      edges {
        node {
          id
          actor {
            ... on User {
              userHandle: login
            }
            ... on Team {
              teamHandle: slug
            }
          }
        }
      }
    }
  }
`

export const GET_ACTOR_USER = gql`
  query GetActorUser($handle: String!) {
    user(login: $handle) {
      id
    }
  }
`

export const GET_ACTOR_TEAM = gql`
  query GetActorTeam($handle: String!, $slug: String!) {
    organization(login: $handle) {
      team(slug: $slug) {
        id
        slug
        name
      }
    }
  }
`

export const GET_REPOSITORY = gql`
  query GetRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
      # a simple workaround to determine the ownership of
      # the repository. if the response contains "userHandle",
      # the repository is owned by an user. On the other hand
      # "organizationHandle" indicates that the repository is
      # owned by an organization.
      owner {
        id
        ... on User {
          userHandle: login
        }
        ... on Organization {
          organizationHandle: login
        }
      }

      branchProtectionRules(first: 100) {
        edges {
          node {
            ...BranchProtectionRule
          }
        }
      }
    }
  }
  ${BranchProtectionRule}
`

export const UPDATE_BRANCH_PROTECTION_RULE = gql`
  mutation UpdateBranchProtectionRule(
    $input: UpdateBranchProtectionRuleInput!
  ) {
    updateBranchProtectionRule(input: $input) {
      branchProtectionRule {
        ...BranchProtectionRule
      }
    }
  }
  ${BranchProtectionRule}
`

export const CREATE_BRANCH_PROTECTION_RULE = gql`
  mutation CreateBranchProtectionRule(
    $input: CreateBranchProtectionRuleInput!
  ) {
    createBranchProtectionRule(input: $input) {
      branchProtectionRule {
        ...BranchProtectionRule
      }
    }
  }
  ${BranchProtectionRule}
`

export const DELETE_BRANCH_PROTECTION_RULE = gql`
  mutation DeleteBranchProtectionRule($id: ID!) {
    deleteBranchProtectionRule(input: {branchProtectionRuleId: $id}) {
      clientMutationId
    }
  }
`
