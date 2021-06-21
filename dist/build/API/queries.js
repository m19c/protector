"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_BRANCH_PROTECTION_RULE = exports.CREATE_BRANCH_PROTECTION_RULE = exports.UPDATE_BRANCH_PROTECTION_RULE = exports.GET_REPOSITORY = exports.GET_ACTOR_TEAM = exports.GET_ACTOR_USER = exports.BranchProtectionRule = void 0;
const core_1 = require("@apollo/client/core");
exports.BranchProtectionRule = core_1.gql `
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
`;
exports.GET_ACTOR_USER = core_1.gql `
  query GetActorUser($handle: String!) {
    user(login: $handle) {
      id
    }
  }
`;
exports.GET_ACTOR_TEAM = core_1.gql `
  query GetActorTeam($handle: String!, $slug: String!) {
    organization(login: $handle) {
      team(slug: $slug) {
        id
        slug
        name
      }
    }
  }
`;
exports.GET_REPOSITORY = core_1.gql `
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
  ${exports.BranchProtectionRule}
`;
exports.UPDATE_BRANCH_PROTECTION_RULE = core_1.gql `
  mutation UpdateBranchProtectionRule(
    $input: UpdateBranchProtectionRuleInput!
  ) {
    updateBranchProtectionRule(input: $input) {
      branchProtectionRule {
        ...BranchProtectionRule
      }
    }
  }
  ${exports.BranchProtectionRule}
`;
exports.CREATE_BRANCH_PROTECTION_RULE = core_1.gql `
  mutation CreateBranchProtectionRule(
    $input: CreateBranchProtectionRuleInput!
  ) {
    createBranchProtectionRule(input: $input) {
      branchProtectionRule {
        ...BranchProtectionRule
      }
    }
  }
  ${exports.BranchProtectionRule}
`;
exports.DELETE_BRANCH_PROTECTION_RULE = core_1.gql `
  mutation DeleteBranchProtectionRule($id: ID!) {
    deleteBranchProtectionRule(input: {branchProtectionRuleId: $id}) {
      clientMutationId
    }
  }
`;
