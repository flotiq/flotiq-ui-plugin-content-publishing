const cachedPublicVersions = {};

export const getPublicVersion = (client, object) => {
  const publicVersion = object?.internal?.workflowPublicVersion;
  const type = object?.internal?.contentType;
  const id = object?.id;

  if (!type || !id) {
    return null;
  }

  const cachedVersion = cachedPublicVersions[type]?.[id];

  if (!publicVersion || publicVersion < 0) {
    if (cachedVersion) delete cachedPublicVersions[type][id];
    return null;
  }

  if (cachedVersion && cachedVersion?.inernal?.latestVersion === publicVersion)
    return cachedPublicVersions[type][id];

  if (!cachedPublicVersions[type]) cachedPublicVersions[type] = {};

  cachedPublicVersions[type][id] = client[type]
    .getVersion(id, publicVersion)
    .then(({ body }) => body);

  return cachedPublicVersions[type][id];
};
