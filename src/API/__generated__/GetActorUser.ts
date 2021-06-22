/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetActorUser
// ====================================================

export interface GetActorUser_user {
  __typename: "User";
  id: string;
}

export interface GetActorUser {
  /**
   * Lookup a user by login.
   */
  user: GetActorUser_user | null;
}

export interface GetActorUserVariables {
  handle: string;
}
