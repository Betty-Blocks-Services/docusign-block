import { expect, test } from "@jest/globals";
import { objectToQueryString } from "../functions/utils";

test("objectToQueryString", () => {
  const params = { hello: "world" };
  expect(objectToQueryString(params)).toBe("hello=world");
});
