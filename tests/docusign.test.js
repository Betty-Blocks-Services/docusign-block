import {
  generateBasicAuthHeader,
  generateAuthenticationRequestOption,
  createEnvelopeJSON,
  createAnchorTabsJson,
  createSignerJSON,
  createEventNotification,
} from "../functions/utils"; // adjust import as needed

describe("generateBasicAuthHeader", () => {
  it("should return a valid Basic auth header", () => {
    const header = generateBasicAuthHeader("secret", "key");
    expect(header).toBe("Basic a2V5OnNlY3JldA=="); // base64 of "key:secret"
  });

  it("should throw an error if key is missing", () => {
    expect(() => generateBasicAuthHeader("secret")).toThrow(
      "No integration key provided!",
    );
  });

  it("should throw an error if secret is missing", () => {
    expect(() => generateBasicAuthHeader(null, "key")).toThrow(
      "No integration secret provided!",
    );
  });
});

describe("generateAuthenticationRequestOption", () => {
  it("should return a valid POST request options object", () => {
    const body = JSON.stringify({ foo: "bar" });
    const result = generateAuthenticationRequestOption("secret", "key", body);

    expect(result).toEqual({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic a2V5OnNlY3JldA==",
      },
      body,
    });
  });

  it("should merge custom headers and preserve content-type", () => {
    const headers = { "Content-Type": "custom/type" };
    const body = "test";
    const result = generateAuthenticationRequestOption(
      "secret",
      "key",
      body,
      headers,
    );
    expect(result.headers["Content-Type"]).toBe("custom/type");
    expect(result.headers.Authorization).toBe("Basic a2V5OnNlY3JldA==");
  });
});

describe("createEnvelopeJSON", () => {
  it("should create envelope JSON with given file details", () => {
    const json = createEnvelopeJSON("testfile", "pdf", "base64content");
    expect(json.documents[0].name).toBe("testfile");
    expect(json.documents[0].fileExtension).toBe("pdf");
    expect(json.documents[0].documentBase64).toBe("base64content");
  });
});

describe("createAnchorTabsJson", () => {
  it("should create tab objects from anchor strings", () => {
    const result = createAnchorTabsJson("anchor1,anchor2");
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      anchorString: "anchor1",
      anchorUnits: "pixels",
      anchorXOffset: "0",
      anchorYOffset: "0",
    });
  });
});

describe("createSignerJSON", () => {
  it("should create a valid signer JSON with all tabs", () => {
    const json = createSignerJSON(
      "email@test.com",
      "Test User",
      "Test",
      "User",
      "1",
      "1",
    );
    expect(json.email).toBe("email@test.com");
    expect(json.tabs.signHereTabs[0].anchorString).toBe("$signHere1");
    expect(json.tabs.firstNameTabs[0].anchorString).toBe("$firstName1");
    expect(json.tabs.emailAddressTabs).toBeDefined(); // check for typo preservation
  });
});

describe("createEventNotification", () => {
  it("should return an empty object if no callback_url is given", () => {
    expect(createEventNotification()).toEqual({});
  });

  it("should return proper notification object with callback_url", () => {
    const url = "https://webhook.site/test";
    const result = createEventNotification(url);
    expect(result.url).toBe(url);
    expect(result.recipientEvents).toHaveLength(4);
    expect(result.eventData.version).toBe("restv2.1");
  });
});
