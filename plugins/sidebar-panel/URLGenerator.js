/**
 * Read key value deep inside object
 * @param {string} key
 * @param {object} object
 * @returns {*} example: read 'object[0].key' from 'object: [{key: value}]
 */
const deepReadKeyValue = (key, object) => {
  return key
    .split(/[[.\]]/)
    .filter((kp) => !!kp)
    .reduce((nestedOptions, keyPart) => {
      return nestedOptions?.[keyPart];
    }, object);
};

export class URLGenerator {
  constructor(config) {
    this.config = config;
  }

  getURL(object, draft) {
    const baseURLInstance = new URL(
      `${this.config.base_url.replace(/\/+$/, "")}/api/flotiq/draft`,
    );
    baseURLInstance.searchParams.set("key", this.config.editor_key);

    const path = this.config.route_template.replace(
      /{(?<key>[^{}]+)}/g,
      (...params) => {
        const { key } = params[4];
        return deepReadKeyValue(key, object);
      },
    );

    baseURLInstance.searchParams.set("draft", draft.toString());
    baseURLInstance.searchParams.set("redirect", `/${path.replace(/^\//)}`);

    return baseURLInstance;
  }
}
