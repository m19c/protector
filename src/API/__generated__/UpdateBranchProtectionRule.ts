/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateBranchProtectionRuleInput } from "./../../global";

// ====================================================
// GraphQL mutation operation: UpdateBranchProtectionRule
// ====================================================

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances_edges_node_actor_User {
  __typename: "User";
  /**
   * The username used to login.
   */
  userHandle: string;
}

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances_edges_node_actor_Team {
  __typename: "Team";
  /**
   * The slug corresponding to the team.
   */
  teamHandle: string;
}

export type UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances_edges_node_actor = UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances_edges_node_actor_User | UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances_edges_node_actor_Team;

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances_edges_node {
  __typename: "ReviewDismissalAllowance";
  id: string;
  /**
   * The actor that can dismiss.
   */
  actor: UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances_edges_node_actor | null;
}

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances_edges {
  __typename: "ReviewDismissalAllowanceEdge";
  /**
   * The item at the end of the edge.
   */
  node: UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances_edges_node | null;
}

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances {
  __typename: "ReviewDismissalAllowanceConnection";
  /**
   * A list of edges.
   */
  edges: (UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances_edges | null)[] | null;
}

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges_node_actor_App {
  __typename: "App";
}

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges_node_actor_User {
  __typename: "User";
  /**
   * The username used to login.
   */
  userHandle: string;
}

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges_node_actor_Team {
  __typename: "Team";
  /**
   * The slug corresponding to the team.
   */
  teamHandle: string;
}

export type UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges_node_actor = UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges_node_actor_App | UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges_node_actor_User | UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges_node_actor_Team;

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges_node {
  __typename: "PushAllowance";
  id: string;
  /**
   * The actor that can push.
   */
  actor: UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges_node_actor | null;
}

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges {
  __typename: "PushAllowanceEdge";
  /**
   * The item at the end of the edge.
   */
  node: UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges_node | null;
}

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances {
  __typename: "PushAllowanceConnection";
  /**
   * A list of edges.
   */
  edges: (UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances_edges | null)[] | null;
}

export interface UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule {
  __typename: "BranchProtectionRule";
  id: string;
  /**
   * Identifies the protection rule pattern.
   */
  pattern: string;
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
   * Number of approving reviews required to update matching branches.
   */
  requiredApprovingReviewCount: number | null;
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
   * Is dismissal of pull request reviews restricted.
   */
  restrictsReviewDismissals: boolean;
  /**
   * Is pushing to matching branches restricted.
   */
  restrictsPushes: boolean;
  /**
   * List of required status check contexts that must pass for commits to be accepted to matching branches.
   */
  requiredStatusCheckContexts: (string | null)[] | null;
  /**
   * Are status checks required to update matching branches.
   */
  requiresStatusChecks: boolean;
  /**
   * Are branches required to be up to date before merging.
   */
  requiresStrictStatusChecks: boolean;
  /**
   * A list review dismissal allowances for this branch protection rule.
   */
  reviewDismissalAllowances: UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_reviewDismissalAllowances;
  /**
   * A list push allowances for this branch protection rule.
   */
  pushAllowances: UpdateBranchProtectionRule_updateBranchProtectionRule_branchProtectionRule_pushAllowances;
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
