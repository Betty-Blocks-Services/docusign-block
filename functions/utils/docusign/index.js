import { encode } from "js-base64";

export function generateBasicAuthHeader(integrationSecret, integrationKey) {
  if (!integrationKey) {
    throw new Error("No integration key provided!");
  }

  if (!integrationSecret) {
    throw new Error("No integration secret provided!");
  }
  if (integrationKey && integrationSecret) {
    return (basicAuthHeader =
      "Basic " + encode(integrationKey + ":" + integrationSecret));
  }
}

export function generateAuthenticationRequestOption(
  integrationSecret,
  integrationKey,
  body,
  headers,
) {
  let basicAuthHeader = generateBasicAuthHeader(
    integrationSecret,
    integrationKey,
  );

  let requestHeaders = headers ? { ...headers } : {};

  if (!requestHeaders || !("Content-Type" in requestHeaders)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  requestHeaders["Authorization"] = basicAuthHeader;

  return {
    method: "POST",
    headers: requestHeaders,
    body,
  };
}

export function createEnvelopeJSON(fileName, fileExtension, documentBase64) {
  return {
    emailSubject: `Signature request for: ${fileName}`,
    emailBlurb: `Your signature has been requested for the document ${fileName}. Please review the document.`,
    documents: [
      {
        documentBase64,
        name: fileName,
        fileExtension,
        documentId: "1",
      },
    ],
    recipients: {
      carbonCopies: [],
      signers: [],
    },
    status: "sent",
    eventNotification: {},
  };
}

export function createAnchorTabsJson(anchorNames) {
  const anchors = anchorNames.split(",");

  return anchors.map((anchor) => ({
    anchorString: anchor,
    anchorUnits: "pixels",
    anchorXOffset: "0",
    anchorYOffset: "0",
  }));
}

export function createSignerJSON(
  email,
  name,
  firstName,
  lastName,
  id,
  routingOrder = "1",
) {
  const firstNameTabs = createAnchorTabsJson(`$firstName${routingOrder}`);
  const lastNameTabs = createAnchorTabsJson(`$lastName${routingOrder}`);
  const fullNameTabs = createAnchorTabsJson(`$fullName${routingOrder}`);
  const companyTabs = createAnchorTabsJson(`$companyName${routingOrder}`);
  const dateSignedTabs = createAnchorTabsJson(`$dateSigned${routingOrder}`);
  const signHereTabs = createAnchorTabsJson(`$signHere${routingOrder}`);
  const emailAddressTabs = createAnchorTabsJson(`$emailAddress${routingOrder}`);

  return {
    email,
    name,
    firstName,
    lastName,
    routingOrder: routingOrder,
    recipientId: id,
    tabs: {
      signHereTabs,
      firstNameTabs,
      lastNameTabs,
      fullNameTabs,
      companyTabs,
      dateSignedTabs,
      emailAddressTabs,
    },
  };
}

export function createEventNotification(callback_url) {
  if (!callback_url) return {};
  return {
    recipientEvents: [
      {
        includeDocuments: "true",
        recipientEventStatusCode: "Completed",
      },
      {
        includeDocuments: "false",
        recipientEventStatusCode: "Declined",
      },
      {
        includeDocuments: "false",
        recipientEventStatusCode: "AuthenticationFailed",
      },
      {
        includeDocuments: "false",
        recipientEventStatusCode: "AutoResponded",
      },
    ],
    eventData: {
      version: "restv2.1",
      format: "json",
    },
    url: callback_url,
  };
}
