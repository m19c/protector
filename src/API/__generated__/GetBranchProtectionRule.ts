/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBranchProtectionRule
// ====================================================

export interface GetBranchProtectionRule_repository_branchProtectionRules_edges_node {
  __typename: "BranchProtectionRule";
  id: string;
  /**
   * Can this branch be deleted.
   */
  allowsDeletions: boolean;
  /**
   * Are force pushes allowed on this branch.
   */
  allowsForcePushes: boolean;
  /**
   * Will new commits pushed to matching branches dismiss pull request review approvals.
   */
  dismissesStaleReviews: boolean;
  /**
   * Can admins overwrite branch protection.
   */
  isAdminEnforced: boolean;
  /**
   * Identifies the protection rule pattern.
   */
  pattern: string;
  /**
   * Number of approving reviews required to update matching branches.
   */
  requiredApprovingReviewCount: number | null;
  /**
   * List of required status check contexts that must pass for commits to be accepted to matching branches.
   */
  requiredStatusCheckContexts: (string | null)[] | null;
  /**
   * Are approving reviews required to update matching branches.
   */
  requiresApprovingReviews: boolean;
  /**
   * Are reviews from code owners required to update matching branches.
   */
  requiresCodeOwnerReviews: boolean;
  /**
   * Are commits required to be signed.
   */
  requiresCommitSignatures: boolean;
  /**
   * Are merge commits prohibited from being pushed to this branch.
   */
  requiresLinearHistory: boolean;
  /**
   * Are status checks required to update matching branches.
   */
  requiresStatusChecks: boolean;
  /**
   * Is pushing to matching branches restricted.
   */
  restrictsPushes: boolean;
  /**
   * Is dismissal of pull request reviews restricted.
   */
  restrictsReviewDismissals: boolean;
}

export interface GetBranchProtectionRule_repository_branchProtectionRules_edges {
  __typename: "BranchProtectionRuleEdge";
  /**
   * The item at the end of the edge.
   */
  node: GetBranchProtectionRule_repository_branchProtectionRules_edges_node | null;
}

export interface GetBranchProtectionRule_repository_branchProtectionRules {
  __typename: "BranchProtectionRuleConnection";
  /**
   * A list of edges.
   */
  edges: (GetBranchProtectionRule_repository_branchProtectionRules_edges | null)[] | null;
}

export interface GetBranchProtectionRule_repository {
  __typename: "Repository";
  /**
   * The name of the repository.
   */
  name: string;
  /**
   * A list of branch protection rules for this repository.
   */
  branchProtectionRules: GetBranchProtectionRule_repository_branchProtectionRules;
}

export interface GetBranchProtectionRule {
  /**
   * Lookup a given repository by the owner and repository name.
   */
  repository: GetBranchProtectionRule_repository | null;
}

export interface GetBranchProtectionRuleVariables {
  owner: string;
  name: string;
}
