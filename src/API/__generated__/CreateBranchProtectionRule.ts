/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateBranchProtectionRuleInput } from "./../../global";

// ====================================================
// GraphQL mutation operation: CreateBranchProtectionRule
// ====================================================

export interface CreateBranchProtectionRule_createBranchProtectionRule_branchProtectionRule {
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

export interface CreateBranchProtectionRule_createBranchProtectionRule {
  __typename: "CreateBranchProtectionRulePayload";
  /**
   * The newly created BranchProtectionRule.
   */
  branchProtectionRule: CreateBranchProtectionRule_createBranchProtectionRule_branchProtectionRule | null;
}

export interface CreateBranchProtectionRule {
  /**
   * Create a new branch protection rule
   */
  createBranchProtectionRule: CreateBranchProtectionRule_createBranchProtectionRule | null;
}

export interface CreateBranchProtectionRuleVariables {
  input: CreateBranchProtectionRuleInput;
}
