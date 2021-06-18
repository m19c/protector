import {diff, extractByPattern} from './config'
import {Specification} from './types'

describe('config', () => {
  test('extractByPattern', () => {
    const current: Specification = {
      patterns: ['dev'],
      allowsDeletions: true,
      requiresStatusChecks: true,
      overrides: {
        dev: {
          allowsDeletions: false
        }
      }
    }

    const result = extractByPattern(current, 'dev')
    expect(result).not.toBeNull()
    expect(result!.allowsDeletions).toBeDefined()
    expect(result!.allowsDeletions).toBe(false)
    expect(result!.requiresStatusChecks).toBeDefined()
    expect(result!.requiresStatusChecks).toBe(true)
    expect(current.patterns).toContain('dev')
    expect(current.allowsDeletions).toBe(true)
    expect(current.requiresStatusChecks).toBe(true)
    expect(current.overrides?.dev?.allowsDeletions).toBe(false)
  })

  describe('diff', () => {
    test('unchanged', () => {
      expect(
        diff(
          {requiredApprovingReviewCount: 1},
          {requiredApprovingReviewCount: 1}
        )
      ).toBeNull()

      expect(
        diff({requiresCodeOwnerReviews: true}, {requiresCodeOwnerReviews: true})
      ).toBeNull()

      expect(
        diff(
          {requiredStatusCheckContexts: ['a']},
          {requiredStatusCheckContexts: ['a']}
        )
      ).toBeNull()
    })

    test('unknown', () => {
      expect(
        diff(
          {requiresCodeOwnerReviews: true},
          {requiresCodeOwnerReviews: true, requiresCommitSignatures: true}
        )
      ).toMatchObject({
        requiresCommitSignatures: true
      })
    })

    test('changed', () => {
      expect(
        diff(
          {requiresCodeOwnerReviews: false, requiredStatusCheckContexts: ['a']},
          {
            requiresCodeOwnerReviews: true,
            requiredStatusCheckContexts: ['b'],
            requiresCommitSignatures: true
          }
        )
      ).toMatchObject({
        requiresCodeOwnerReviews: true,
        requiredStatusCheckContexts: ['b'],
        requiresCommitSignatures: true
      })
    })

    test('removed', () => {
      expect(
        diff(
          {
            requiresApprovingReviews: true,
            requiredApprovingReviewCount: 2
          },
          {
            requiresApprovingReviews: false
          }
        )
      ).toMatchObject({
        requiresApprovingReviews: false,
        requiredApprovingReviewCount: 1
      })

      expect(
        diff({requiresCodeOwnerReviews: true}, {requiresCommitSignatures: true})
      ).toMatchObject({
        requiresCodeOwnerReviews: false,
        requiresCommitSignatures: true
      })
    })

    test('real world', () => {
      expect(
        diff(
          {},
          {
            allowsDeletions: false,
            allowsForcePushes: false,
            dismissesStaleReviews: true,
            isAdminEnforced: true,
            requiredApprovingReviewCount: 1,
            requiredStatusCheckContexts: ['ci'],
            requiresApprovingReviews: false,
            requiresCodeOwnerReviews: false,
            requiresCommitSignatures: true,
            requiresConversationResolution: true,
            requiresLinearHistory: false,
            requiresStatusChecks: false,
            restrictsPushes: false,
            restrictsReviewDismissals: true
          }
        )
      ).toMatchObject({
        allowsDeletions: false,
        allowsForcePushes: false,
        dismissesStaleReviews: true,
        isAdminEnforced: true,
        requiredApprovingReviewCount: 1,
        requiredStatusCheckContexts: ['ci'],
        requiresApprovingReviews: false,
        requiresCodeOwnerReviews: false,
        requiresCommitSignatures: true,
        requiresConversationResolution: true,
        requiresLinearHistory: false,
        requiresStatusChecks: false,
        restrictsPushes: false,
        restrictsReviewDismissals: true
      })
    })
  })
})
