/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Autogenerated input type of CreateBranchProtectionRule
 */
export interface CreateBranchProtectionRuleInput {
  allowsDeletions?: boolean | null;
  allowsForcePushes?: boolean | null;
  clientMutationId?: string | null;
  dismissesStaleReviews?: boolean | null;
  isAdminEnforced?: boolean | null;
  pattern: string;
  pushActorIds?: string[] | null;
  repositoryId: string;
  requiredApprovingReviewCount?: number | null;
  requiredStatusCheckContexts?: string[] | null;
  requiresApprovingReviews?: boolean | null;
  requiresCodeOwnerReviews?: boolean | null;
  requiresCommitSignatures?: boolean | null;
  requiresLinearHistory?: boolean | null;
  requiresStatusChecks?: boolean | null;
  requiresStrictStatusChecks?: boolean | null;
  restrictsPushes?: boolean | null;
  restrictsReviewDismissals?: boolean | null;
  reviewDismissalActorIds?: string[] | null;
}

/**
 * Autogenerated input type of UpdateBranchProtectionRule
 */
export interface UpdateBranchProtectionRuleInput {
  allowsDeletions?: boolean | null;
  allowsForcePushes?: boolean | null;
  branchProtectionRuleId: string;
  clientMutationId?: string | null;
  dismissesStaleReviews?: boolean | null;
  isAdminEnforced?: boolean | null;
  pattern?: string | null;
  pushActorIds?: string[] | null;
  requiredApprovingReviewCount?: number | null;
  requiredStatusCheckContexts?: string[] | null;
  requiresApprovingReviews?: boolean | null;
  requiresCodeOwnerReviews?: boolean | null;
  requiresCommitSignatures?: boolean | null;
  requiresLinearHistory?: boolean | null;
  requiresStatusChecks?: boolean | null;
  requiresStrictStatusChecks?: boolean | null;
  restrictsPushes?: boolean | null;
  restrictsReviewDismissals?: boolean | null;
  reviewDismissalActorIds?: string[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================