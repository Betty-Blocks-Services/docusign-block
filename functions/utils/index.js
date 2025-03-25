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
  generateCodeChallenge,
  Logger,
  objectToQueryString,
  parseCollection,
  parseMapVariables,
  parseProperty,
};
