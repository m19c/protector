import {gql} from '@apollo/client/core'

export const BranchProtectionRule = gql`
  fragment BranchProtectionRule on BranchProtectionRule {
    id
    allowsDeletions
    allowsForcePushes
    dismissesStaleReviews
    isAdminEnforced
    pattern
    requiredApprovingReviewCount
    requiredStatusCheckContexts
    requiresApprovingReviews
    requiresCodeOwnerReviews
    requiresCommitSignatures
    # requiresConversationResolution
    requiresLinearHistory
    requiresStatusChecks
    restrictsPushes
    restrictsReviewDismissals
  }
`

export const GET_REPOSITORY = gql`
  query GetRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
    }
  }
`

export const GET_BRANCH_PROTECTION_RULE = gql`
  query GetBranchProtectionRule($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
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
