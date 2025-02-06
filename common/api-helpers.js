const cachedPublicVersions = {};

export const getPublicVersion = (client, object) => {
  // @todo return object based on header public, not version
  const publicVersion = object?.internal?.publicVersion;
  const type = object?.internal?.contentType;
  const id = object?.id;

  if (!type || !id) {
    return null;
  }

  if (!publicVersion || publicVersion < 0) {
    return null;
  }

  const cachedVersion = cachedPublicVersions[type]?.[id]?.[publicVersion];
  if (cachedVersion) return cachedVersion;

  if (!cachedPublicVersions[type]) cachedPublicVersions[type] = {};
  if (!cachedPublicVersions[type][id]) cachedPublicVersions[type][id] = {};

  cachedPublicVersions[type][id][publicVersion] = client[type]
    .getVersion(id, publicVersion)
    .then(({ body }) => (
      body.code === 200
        ? body
        : object
    ));

  return cachedPublicVersions[type][id][publicVersion];
};
