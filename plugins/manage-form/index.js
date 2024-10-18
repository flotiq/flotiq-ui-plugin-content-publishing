import i18n from "../../i18n";
import { getSchema } from "./form-schema";
import pluginInfo from "../../plugin-manifest.json";

let configCache = null;

export const handleManagePlugin = (
  { plugin, contentTypes, modalInstance },
  getLanguage,
) => {
  if (plugin?.id !== pluginInfo.id) return null;

  if (configCache) return configCache;

  const ctds = (contentTypes || [])
    .filter((ctd) => !ctd.internal || ctd.name === "_media")
    .map(({ name, label }) => ({ value: name, label }));

  const language = getLanguage();
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }

  configCache = {};

  configCache.schema = getSchema(ctds);
  modalInstance.promise.then(() => (configCache = null));

  return configCache;
};
