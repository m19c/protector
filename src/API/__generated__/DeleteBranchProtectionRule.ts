/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteBranchProtectionRule
// ====================================================

export interface DeleteBranchProtectionRule_deleteBranchProtectionRule {
  __typename: "DeleteBranchProtectionRulePayload";
  /**
   * A unique identifier for the client performing the mutation.
   */
  clientMutationId: string | null;
}

export interface DeleteBranchProtectionRule {
  /**
   * Delete a branch protection rule
   */
  deleteBranchProtectionRule: DeleteBranchProtectionRule_deleteBranchProtectionRule | null;
}

export interface DeleteBranchProtectionRuleVariables {
  id: string;
}
