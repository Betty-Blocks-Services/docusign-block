import { generateAuthenticationRequestOption, Logger } from "../../utils";

const docusignRefreshAccessToken = async ({
  accessTokenInput,
  refreshTokenInput,
  expiresAtInput,
  integrationSecret,
  integrationKey,
  url,
  logging,
}) => {
  const logger = new Logger(logging);
  try {
    if (!accessTokenInput || !refreshTokenInput) {
      throw new Error(
        "The user has not yet authorized this app to make requests at DocuSign. Make sure you provide an access token and a refresh token!",
      );
    }

    let valid = false;

    if (expiresAtInput) {
      const expiresAtDate = new Date(expiresAtInput);
      const now = new Date();
      valid = expiresAtDate > now;
    }

    logger.debug(`Refresh token is valid: ${valid}`);

    if (valid) {
      return {
        accessToken: accessTokenInput,
        refreshToken: refreshTokenInput,
        expiresAt: expiresAtInput,
      };
    }

    const body = {
      grant_type: "refresh_token",
      refresh_token: refreshTokenInput,
    };

    const options = generateAuthenticationRequestOption(
      integrationSecret,
      integrationKey,
      JSON.stringify(body),
    );

    const response = await fetch(url, options);
    const data = await response.json();

    if (!data || !data.access_token) {
      throw new Error(
        `Expected data to contain 'access_token' but received: ${JSON.stringify(data)}`,
      );
    }

    const now = new Date();
    const newExpiresAt = new Date(
      now.setSeconds(now.getSeconds() + data.expires_in),
    ).toISOString();
    const result = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: newExpiresAt,
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
};

export default docusignRefreshAccessToken;
