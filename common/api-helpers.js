const cachedPublicVersions = {};

export const getPublicVersion = (client, object) => {
  const status = object?.internal?.status;
  const type = object?.internal?.contentType;
  const id = object?.id;

  if (!type || !id) {
    return null;
  }

  if (!["modified", "draft"].includes(status)) {
    return null;
  }

  const cachedVersion = cachedPublicVersions[type]?.[id]?.[status];
  if (cachedVersion) return cachedVersion;

  if (!cachedPublicVersions[type]) cachedPublicVersions[type] = {};
  if (!cachedPublicVersions[type][id]) cachedPublicVersions[type][id] = {};

  cachedPublicVersions[type][id][status] = client[type]
    .get(id, true)
    .then(({ body }) => (body.code === 200 ? body : object));

  return cachedPublicVersions[type][id][status];
};
