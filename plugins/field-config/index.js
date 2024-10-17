import pluginInfo from "../../plugin-manifest.json";

export const handleFormFieldConfig = ({ config, contentType, name }) => {
  if (
    contentType?.id === pluginInfo.id &&
    contentType?.nonCtdSchema &&
    name === "editor_key"
  ) {
    config.type = "password";
    config.autoComplete = "off";
  }
};
