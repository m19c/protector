"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
describe('config', () => {
    test('extractByPattern', () => {
        var _a, _b;
        const current = {
            patterns: ['dev'],
            allowsDeletions: true,
            requiresStatusChecks: true,
            overrides: {
                dev: {
                    allowsDeletions: false
                }
            }
        };
        const result = config_1.extractByPattern(current, 'dev');
        expect(result).not.toBeNull();
        expect(result.allowsDeletions).toBeDefined();
        expect(result.allowsDeletions).toBe(false);
        expect(result.requiresStatusChecks).toBeDefined();
        expect(result.requiresStatusChecks).toBe(true);
        expect(current.patterns).toContain('dev');
        expect(current.allowsDeletions).toBe(true);
        expect(current.requiresStatusChecks).toBe(true);
        expect((_b = (_a = current.overrides) === null || _a === void 0 ? void 0 : _a.dev) === null || _b === void 0 ? void 0 : _b.allowsDeletions).toBe(false);
    });
    describe('diff', () => {
        test('unchanged', () => {
            expect(config_1.diff({ requiredApprovingReviewCount: 1 }, { requiredApprovingReviewCount: 1 })).toBeNull();
            expect(config_1.diff({ requiresCodeOwnerReviews: true }, { requiresCodeOwnerReviews: true })).toBeNull();
            expect(config_1.diff({ requiredStatusCheckContexts: ['a'] }, { requiredStatusCheckContexts: ['a'] })).toBeNull();
        });
        test('unknown', () => {
            expect(config_1.diff({ requiresCodeOwnerReviews: true }, { requiresCodeOwnerReviews: true, requiresCommitSignatures: true })).toMatchObject({
                requiresCommitSignatures: true
            });
        });
        test('changed', () => {
            expect(config_1.diff({ requiresCodeOwnerReviews: false, requiredStatusCheckContexts: ['a'] }, {
                requiresCodeOwnerReviews: true,
                requiredStatusCheckContexts: ['b'],
                requiresCommitSignatures: true
            })).toMatchObject({
                requiresCodeOwnerReviews: true,
                requiredStatusCheckContexts: ['b'],
                requiresCommitSignatures: true
            });
        });
        test('removed', () => {
            expect(config_1.diff({
                requiresApprovingReviews: true,
                requiredApprovingReviewCount: 2
            }, {
                requiresApprovingReviews: false
            })).toMatchObject({
                requiresApprovingReviews: false,
                requiredApprovingReviewCount: 1
            });
            expect(config_1.diff({ requiresCodeOwnerReviews: true }, { requiresCommitSignatures: true })).toMatchObject({
                requiresCodeOwnerReviews: false,
                requiresCommitSignatures: true
            });
        });
        test('real world', () => {
            expect(config_1.diff({}, {
                allowsDeletions: false,
                allowsForcePushes: false,
                dismissesStaleReviews: true,
                isAdminEnforced: true,
                requiredApprovingReviewCount: 1,
                requiredStatusCheckContexts: ['ci'],
                requiresApprovingReviews: false,
                requiresCodeOwnerReviews: false,
                requiresCommitSignatures: true,
                requiresLinearHistory: false,
                requiresStatusChecks: false,
                restrictsPushes: false,
                restrictsReviewDismissals: true
            })).toMatchObject({
                allowsDeletions: false,
                allowsForcePushes: false,
                dismissesStaleReviews: true,
                isAdminEnforced: true,
                requiredApprovingReviewCount: 1,
                requiredStatusCheckContexts: ['ci'],
                requiresApprovingReviews: false,
                requiresCodeOwnerReviews: false,
                requiresCommitSignatures: true,
                requiresLinearHistory: false,
                requiresStatusChecks: false,
                restrictsPushes: false,
                restrictsReviewDismissals: true
            });
        });
    });
});
