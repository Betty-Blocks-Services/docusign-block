import {
  arrayBufferToBase64,
  createEventNotification,
  createSignerJSON,
  Logger,
  parseCollection,
  parseProperty,
} from "../../utils/index.js";

const DocuSignCreateSignatureRequest = async ({
  document,
  baseURL,
  accountID,
  signerCollection,
  firstNameProperty,
  lastNameProperty,
  fullNameProperty,
  emailProperty,
  routingOrderProperty,
  carbonCopies,
  callbackUrl,
  accessToken,

  logging,
}) => {
  const logger = new Logger(logging);
  logger.debug({
    baseURL,
    signerCollection,
    firstNameProperty,
    lastNameProperty,
    fullNameProperty,
    emailProperty,
  });

  try {
    if (!document || Object.keys(document).length === 0) {
      logger.debug("Document:", document);
      throw new Error("No valid document provided");
    }

    if (firstNameProperty && !lastNameProperty) {
      logger.debug({ firstNameProperty, lastNameProperty });
      throw new Error(
        `\"Last Name Property\" is required if you've also provided a \"First Name Property\"`,
      );
    }

    if (!firstNameProperty && lastNameProperty) {
      logger.debug({ firstNameProperty, lastNameProperty });
      throw new Error(
        `\"First Name Property\" is required if you've also provided a \"Last Name Property\"`,
      );
    }

    if (!fullNameProperty) {
      logger.debug({ fullNameProperty });
      throw new Error(`\"Full Name Property\" is required!`);
    }
    if (!emailProperty) {
      logger.debug({ fullNameProperty });
      throw new Error(`\"Email Property Provided\" is required!`);
    }

    const signers = parseCollection(signerCollection);
    logger.debug({ signers });

    logger.debug(`Need to create ${signers.length} SignerTabs`);

    if (!signers || signers.length === 0) {
      throw new Error("The Signer Collection yielded no records!");
    }
    // File to b64
    const fileExtension = document.name.split(".")[1];
    const fileName = document.name.split(".")[0];
    const fileURL = document.url;

    logger.debug({ fileExtension, fileName, fileUrl: fileURL });

    if (!fileExtension | !fileName | !fileURL) {
      throw new Error("Something went wrong while parsing the document", {
        fileExtension,
        fileName,
        fileURL,
      });
    }

    const downloadFileResponse = await fetch(fileURL);
    const blob = await downloadFileResponse.blob();
    const buffer = blob.buffer;
    const docbase64 = arrayBufferToBase64(buffer);

    if (!docbase64) {
      throw new Error("Could not convert file to base64");
    }

    const signersJSON = [];
    const parsedEmailProp = parseProperty(emailProperty);
    const parsedNameProp = parseProperty(fullNameProperty);
    const parsedRoutingOrderProp = parseProperty(routingOrderProperty);
    const parsedFirstNameProp = parseProperty(firstNameProperty);
    const parsedLastNameProp = parseProperty(lastNameProperty);

    for (const [index, signer] of signers.entries()) {
      const shiftedIndex = index + 1;
      const email = signer[parsedEmailProp.name];
      const name = signer[parsedNameProp.name];
      const id = signer["id"];
      const routingOrder = parsedRoutingOrderProp
        ? signer[parsedRoutingOrderProp] || shiftedIndex
        : shiftedIndex;

      // Following properties must always fall back to undefined
      // DocuSign will throw an error if an empty ("" or null) firstName or lastName is provided

      const firstName = parsedFirstNameProp
        ? signer[parsedFirstNameProp.name] || undefined
        : undefined;
      const lastName = parsedLastNameProp
        ? signer[parsedLastNameProp.name] || undefined
        : undefined;

      if ((firstName && !lastName) || (!firstName && lastName)) {
        throw new Error(
          `Expected both \"First name\" and \"Last name\" for signer: ${email} but got \"First name: ${firstName}\" and \"Last name: ${lastName}\"`,
        );
      }

      const signerJSON = createSignerJSON(
        email,
        name,
        firstName,
        lastName,
        id.toString(),
        routingOrder.toString(),
      );
      signersJSON.push(signerJSON);
    }

    const carbonCopiesJSON = [];
    //add Carbon Copies
    if (carbonCopies) {
      cc_col = carbonCopies.split(",");
      cc_col.forEach((cc, index) => {
        carbonCopiesJSON.push({
          email: cc,
          name: cc,
          recipientId: `${index + 3}`,
          routingOrder: `${index + 3}`,
        });
        // index + 3 to make sure the recipientId is not the same as the signerIds
      });
    }

    const envelopeJson = {
      emailSubject: `Signature request for: ${fileName}`,
      emailBlurb: `Your signature has been requested for the document ${fileName}. Please review the document.`,
      documents: [
        {
          documentBase64: docbase64,
          name: fileName,
          fileExtension: fileExtension,
          documentId: "1",
        },
      ],
      recipients: {
        carbonCopies: carbonCopiesJSON,
        signers: signersJSON,
      },
      status: "sent",
      eventNotification: createEventNotification(callbackUrl),
    };

    let envelopeForLog = {
      ...envelopeJson,
      documents: [],
    };

    logger.debug({ envelopeForLog });

    envelopeForLog = undefined; // Clear memory

    const bearerToken = accessToken.startsWith("Bearer ")
      ? accessToken
      : `Bearer ${accessToken}`;

    const envelopesURL = `${baseURL}/restapi/v2.1/accounts/${accountID}/envelopes`;

    logger.debug({ bearerToken, envelopesURL });

    const createEnvelopeResponse = await fetch(envelopesURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
      body: JSON.stringify(envelopeJson),
    });

    const result = await createEnvelopeResponse.json();

    logger.debug({ result });
    if ("errorCode" in result) {
      throw new Error("DocuSign returned an error: " + result.errorCode);
    } else {
      return { envelope_id: result.envelopeId };
    }
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
    const message = typeof err === "string" ? err : err.message || "UNKOWN";
    logger.error(message === "UNKOWN" ? err : message);

    throw new Error(message);
  }
};
export default DocuSignCreateSignatureRequest;
