/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateBranchProtectionRuleInput } from "./../../global";

// ====================================================
// GraphQL mutation operation: UpdateBranchProtectionRule
// ====================================================

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule {
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

export interface UpdateBranchProtectionRule_updateBranchProtectionRule {
  __typename: "UpdateBranchProtectionRulePayload";
  /**
   * The newly created BranchProtectionRule.
   */
  branchProtectionRule: UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule | null;
}

export interface UpdateBranchProtectionRule {
  /**
   * Create a new branch protection rule
   */
  updateBranchProtectionRule: UpdateBranchProtectionRule_updateBranchProtectionRule | null;
}

export interface UpdateBranchProtectionRuleVariables {
  input: UpdateBranchProtectionRuleInput;
}
