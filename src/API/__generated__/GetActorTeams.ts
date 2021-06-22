/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetActorTeams
// ====================================================

export interface GetActorTeams_organization_team {
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

export interface GetActorTeams_organization {
  __typename: "Organization";
  /**
   * Find an organization's team by its slug.
   */
  team: GetActorTeams_organization_team | null;
}

export interface GetActorTeams {
  /**
   * Lookup a organization by login.
   */
  organization: GetActorTeams_organization | null;
}

export interface GetActorTeamsVariables {
  handle: string;
  slug: string;
}
