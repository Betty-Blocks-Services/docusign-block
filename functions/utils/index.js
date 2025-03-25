// Barrel File
//
// Import your utility functions here
import {
  parseCollection,
  parseMapVariables,
  parseProperty,
} from "./action-input";
import {
  arrayBufferToBase64,
  base64UrlEncode,
  downloadFile,
  fileToBase64,
} from "./base64/";
import { generateCodeChallenge } from "./crypto";
import {
  createEnvelopeJSON,
  createEventNotification,
  createSignerJSON,
  createAnchorTabsJson,
  generateAuthenticationRequestOption,
  generateBasicAuthHeader,
} from "./docusign";
import Logger from "./logger";

/**
 * Converts an object to a URL-encoded query string.
 * @param {Object} params - The object to convert.
 * @returns {string} - URL query string.
 */
function objectToQueryString(params) {
  return Object.entries(params)
    .filter(([_, value]) => value)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
}

/**
 * Returns an Authorization header with the provided token
 * @param {string} token
 * @returns {Object} - Authorization Header
 *
 * @example
 * generateBearerHeader("token")
 * // result { Authorization: "Bearer token"}
 */
function generateBearerHeader(token) {
  return {
    Authorization: accessToken.startsWith("Bearer ")
      ? accessToken
      : `Bearer ${accessToken}`,
  };
}

// Export your utility functions here
export {
  arrayBufferToBase64,
  base64UrlEncode,
  createEnvelopeJSON,
  createEventNotification,
  createSignerJSON,
  downloadFile,
  fileToBase64,
  createAnchorTabsJson,
  generateAuthenticationRequestOption,
  generateBasicAuthHeader,
  generateBearerHeader,
  generateCodeChallenge,
  Logger,
  objectToQueryString,
  parseCollection,
  parseMapVariables,
  parseProperty,
};
