/**
 * Converts an array of key-value pairs into a single object map.
 *
 * @param headers - An array of objects with `key` and `value` properties.
 * @returns An object where each key maps to its corresponding value.
 *
 * @example
 * parseMapVariables([{ key: 'Authorization', value: 'Bearer token' }]);
 * // => { Authorization: 'Bearer token' }
 */
export function parseMapVariables(headers) {
  return headers.reduce(
    (acc, { key, value }) => ({ ...acc, [key]: value }),
    {},
  );
}

/**
 * Extracts the `data` array from a collection object.
 *
 * @param collection - An object with a `data` property containing an array of records.
 * @returns The `data` array if present, otherwise an empty array.
 *
 * @example
 * parseCollection({ data: [{ id: 1 }, { id: 2 }] });
 * // => [{ id: 1 }, { id: 2 }]
 */
export function parseCollection(collection) {
  return collection.data || [];
}

/**
 * Extracts the first property from an array of properties.
 *
 * @param property - An array of objects, each with `name` and `kind` fields.
 * @returns The first object in the array if it exists, otherwise `null`.
 *
 * @example
 * parseProperty([{ name: 'username', kind: 'string' }]);
 * // => { name: 'username', kind: 'string' }
 */
export function parseProperty(property) {
  return property && property.length > 0 ? property[0] : null;
}
