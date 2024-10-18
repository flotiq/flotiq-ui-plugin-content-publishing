import { registerFn } from "../common/plugin-element-cache";
import cssString from "inline:./styles/index.css";
import pluginInfo from "../plugin-manifest.json";
import { handleManagePlugin } from "./manage-form";
import { handlePanelPlugin } from "./sidebar-panel";
import { handleFormFieldConfig } from "./field-config";
import i18n from "../i18n";

const loadStyles = () => {
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement("style");
    style.id = `${pluginInfo.id}-styles`;
    style.textContent = cssString;
    document.head.appendChild(style);
  }
};

registerFn(
  pluginInfo,
  (handler, client, { getLanguage, getPluginSettings }) => {
    loadStyles();

    const language = getLanguage();
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }

    handler.on("flotiq.plugins.manage::form-schema", (data) =>
      handleManagePlugin(data),
    );
    handler.on("flotiq.form.sidebar-panel::add", (data) =>
      handlePanelPlugin(data, getPluginSettings, client),
    );
    handler.on("flotiq.form.field::config", (data) =>
      handleFormFieldConfig(data),
    );
    handler.on("flotiq.language::changed", ({ language }) => {
      if (language !== i18n.language) {
        i18n.changeLanguage(language);
      }
    });
  },
);
