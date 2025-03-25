import { Logger, objectToQueryString } from "../../utils";

const docuSignGetAuthenticationURL = async ({
  url,
  scope,
  clientID: client_id,
  redirectURI: redirect_uri,
  state,
  loginHint: login_hint,
  logging,
}) => {
  const logger = new Logger(logging);
  logger.debug("Getting DocuSign Authentication URL");
  const params = {
    response_type: "code",
    scope,
    client_id,
    state,
    redirect_uri,
    login_hint,
  };

  logger.debug({ params });

  return { result: `${url}?${objectToQueryString(params)}` };
};

export default docuSignGetAuthenticationURL;
