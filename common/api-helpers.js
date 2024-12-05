const cachedPublicVersions = {};

export const getPublicVersion = (client, object) => {
  const publicVersion = object?.internal?.workflowPublicVersion;
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
    .then(({ body }) => body);

  return cachedPublicVersions[type][id][publicVersion];
};
