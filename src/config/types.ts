import type {BranchProtectionRule} from '../API/__generated__/BranchProtectionRule'

export type Pattern = string

export type Protection = Pick<
  BranchProtectionRule,
  | 'requiresApprovingReviews'
  | 'requiredApprovingReviewCount'
  | 'allowsDeletions'
  | 'allowsForcePushes'
  | 'dismissesStaleReviews'
  | 'isAdminEnforced'
  | 'requiredStatusCheckContexts'
  | 'requiresCodeOwnerReviews'
  | 'requiresCommitSignatures'
  | 'requiresLinearHistory'
  | 'requiresStatusChecks'
  | 'restrictsPushes'
  | 'restrictsReviewDismissals'
>

export interface Specification extends Protection {
  /**
   * A list of matching branch patterns.
   */
  patterns?: Pattern[]

  overrides?: Record<Pattern, Protection>
}
