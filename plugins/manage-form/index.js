import { getSchema } from "./form-schema";
import pluginInfo from "../../plugin-manifest.json";

let configCache = null;

export const handleManagePlugin = ({ plugin, contentTypes, modalInstance }) => {
  if (plugin?.id !== pluginInfo.id) return null;

  if (configCache) return configCache;

  const ctds = (contentTypes || [])
    .filter((ctd) => !ctd.internal || ctd.name === "_media")
    .map(({ name, label }) => ({ value: name, label }));

  configCache = {};

  configCache.schema = getSchema(ctds);
  modalInstance.promise.then(() => (configCache = null));

  return configCache;
};
