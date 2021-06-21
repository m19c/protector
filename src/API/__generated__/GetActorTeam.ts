/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetActorTeam
// ====================================================

export interface GetActorTeam_organization_team {
  __typename: "Team";
  id: string;
  /**
   * The slug corresponding to the team.
   */
  slug: string;
  /**
   * The name of the team.
   */
  name: string;
}

export interface GetActorTeam_organization {
  __typename: "Organization";
  /**
   * Find an organization's team by its slug.
   */
  team: GetActorTeam_organization_team | null;
}

export interface GetActorTeam {
  /**
   * Lookup a organization by login.
   */
  organization: GetActorTeam_organization | null;
}

export interface GetActorTeamVariables {
  handle: string;
  slug: string;
}
