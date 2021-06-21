import type {BranchProtectionRule} from '../API/__generated__/BranchProtectionRule'

export type Pattern = string

export interface Protection
  extends Pick<
    BranchProtectionRule,
    /**
     * Can this branch be deleted.
     */
    | 'allowsDeletions'
    /**
     * Are force pushes allowed on this branch.
     */
    | 'allowsForcePushes'
    /**
     * Will new commits pushed to matching branches dismiss pull request review approvals.
     */
    | 'dismissesStaleReviews'
    /**
     * Can admins overwrite branch protection.
     */
    | 'isAdminEnforced'
    /**
     * Number of approving reviews required to update matching branches.
     */
    | 'requiredApprovingReviewCount'
    /**
     * Are approving reviews required to update matching branches.
     */
    | 'requiresApprovingReviews'
    /**
     * Are reviews from code owners required to update matching branches.
     */
    | 'requiresCodeOwnerReviews'
    /**
     * Are commits required to be signed.
     */
    | 'requiresCommitSignatures'
    /**
     * Are merge commits prohibited from being pushed to this branch.
     */
    | 'requiresLinearHistory'
    /**
     * Is dismissal of pull request reviews restricted.
     */
    | 'restrictsReviewDismissals'
    /**
     * Is pushing to matching branches restricted.
     */
    | 'restrictsPushes'
    /**
     * List of required status check contexts that must pass for commits to be accepted to matching branches.
     */
    | 'requiredStatusCheckContexts'
    /**
     * Are status checks required to update matching branches.
     */
    | 'requiresStatusChecks'
    /**
     * Are branches required to be up to date before merging.
     */
    | 'requiresStrictStatusChecks'
  > {
  /**
   * A list of User or Team IDs allowed to dismiss reviews on pull requests targeting matching branches.
   */
  reviewDismissalActors: string[]

  /**
   * A list of User, Team or App IDs allowed to push to matching branches.
   */
  pushActors: string[]
}

export interface Specification extends Partial<Protection> {
  /**
   * A list of matching branch patterns.
   */
  patterns?: Pattern[]

  overrides?: Record<Pattern, Partial<Protection>>
}
