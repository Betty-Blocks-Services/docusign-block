import {
  generateAuthenticationRequestOption,
  Logger,
  parseMapVariables,
} from "../../utils/index";

export default async function docusignGetAccessToken({
  integrationSecret,
  integrationKey,
  url,
  body,
  headers = [],
  logging,
}) {
  const logger = new Logger(logging);
  logger.debug({
    url,
    body,
    headers,
  });
  try {
    const requestBody = parseMapVariables(body);
    const requestHeaders = parseMapVariables(headers);

    const options = generateAuthenticationRequestOption(
      integrationSecret,
      integrationKey,
      JSON.stringify(requestBody),
      requestHeaders,
    );

    logger.debug({ options });

    const response = await fetch(url, options);

    const data = await response.json();

    logger.debug({ data });

    if (!data || !data.access_token) {
      throw new Error(
        `Expected data to contain 'access_token' but received: ${JSON.stringify(data)}`,
      );
    }

    const now = new Date();
    const expiresAt = new Date(
      now.setSeconds(now.getSeconds() + data.expires_in),
    ).toISOString();
    const result = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      tokenType: data.token_type,
      scope: data.scope,
    };
    logger.debug({ result });
    return result;
  } catch (err) {
    // Makes sure that the error is also logged to the debug logger.
    logger.error(
      "An unexpected error occurred when executing action: DocuSign - Get Access Token",
    );

    if (Array.isArray(err)) {
      err.forEach((error) => {
        logger.error(error.message);
      });
    }
    const message = typeof err === "string" ? err : (err.message ?? "UNKOWN");
    logger.error(message === "UNKOWN" ? err : message);

    throw new Error(message);
  }
}
