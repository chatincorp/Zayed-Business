/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminGuard from "../adminGuard.js";
import type * as adminRbac from "../adminRbac.js";
import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as contact from "../contact.js";
import type * as content from "../content.js";
import type * as emailHook from "../emailHook.js";
import type * as fmcg from "../fmcg.js";
import type * as http from "../http.js";
import type * as leads from "../leads.js";
import type * as markets from "../markets.js";
import type * as projects from "../projects.js";
import type * as settings from "../settings.js";
import type * as tabloidIngest from "../tabloidIngest.js";
import type * as tabloidNews from "../tabloidNews.js";
import type * as testimonials from "../testimonials.js";
import type * as users from "../users.js";
import type * as verification from "../verification.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminGuard: typeof adminGuard;
  adminRbac: typeof adminRbac;
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  contact: typeof contact;
  content: typeof content;
  emailHook: typeof emailHook;
  fmcg: typeof fmcg;
  http: typeof http;
  leads: typeof leads;
  markets: typeof markets;
  projects: typeof projects;
  settings: typeof settings;
  tabloidIngest: typeof tabloidIngest;
  tabloidNews: typeof tabloidNews;
  testimonials: typeof testimonials;
  users: typeof users;
  verification: typeof verification;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
