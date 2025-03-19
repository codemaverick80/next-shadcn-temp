"use server";
import { UserId, UserSession } from "@/types";
import { env } from "@/env.mjs";

import { GoogleUser } from "@/app/api/login/google/callback/route";
import {
  createGoogleUser,
  getUserByEmail,
} from "@/app-db-access/user.data-access";
import { createAccountViaGoogle } from "@/app-db-access/account.data-access";
import { createProfile, getProfile } from "@/app-db-access/profile.data-access";
import { assignDefaultRoleToUser } from "./role.services";

/* ``````````````````````` Auth related ```````````````````````` */

export async function createGoogleUserService(googleUser: GoogleUser) {
  let existingUser = await getUserByEmail(googleUser.email); //INFO: check if user is already exists in 'users' table

  if (!existingUser) {
    existingUser = await createGoogleUser(googleUser); //INFO: create user in 'users' table
    // Assign default role to new user
    await assignDefaultRoleToUser(existingUser.id); //INFO: assign default role to user 'user'
  }

  //TODO: very first time, we need to flag isApproved=false, once that account is reviewed by admin , then it will be set true
  //INFO: if account isApproved=false then user should not be allowed to do any activities
  await createAccountViaGoogle(existingUser.id, googleUser.sub); //INFO: create account in 'accounts' table
  await createProfile(
    existingUser.id,
    googleUser.name,
    googleUser.picture,
    googleUser.given_name,
    googleUser.family_name
  ); //INFO: create profile in 'profiles' table
  return existingUser.id;
}

//
// export async function createGithubUserService(githubUser: GitHubUser) {
//     let existingUser = await getUserByEmail(githubUser.email);
//
//     if (!existingUser) {
//         existingUser = await createUser(githubUser.email);
//     }
//
//     await createAccountViaGithub(existingUser.id, githubUser.id);
//
//     await createProfile(existingUser.id, githubUser.sign-in, githubUser.avatar_url);
//
//     return existingUser.id;
// }

export async function getUserProfileService(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new Error("User not found");
  }
  return profile;
}

export async function getProfileImageUrl(userId: UserId, imageId: string) {
  return `${env.HOST_NAME}/api/users/${userId}/images/${imageId ?? "default"}`;
}
