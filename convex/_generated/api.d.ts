/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as libraryVideos from "../libraryVideos.js";
import type * as news from "../news.js";
import type * as regulationCategories from "../regulationCategories.js";
import type * as regulationSubCategories from "../regulationSubCategories.js";
import type * as regulations from "../regulations.js";
import type * as videoCategories from "../videoCategories.js";
import type * as videoSubCategories from "../videoSubCategories.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  libraryVideos: typeof libraryVideos;
  news: typeof news;
  regulationCategories: typeof regulationCategories;
  regulationSubCategories: typeof regulationSubCategories;
  regulations: typeof regulations;
  videoCategories: typeof videoCategories;
  videoSubCategories: typeof videoSubCategories;
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
