import { registerFn } from "../common/plugin-element-cache";
import cssString from "inline:./styles/index.css";
import pluginInfo from "../plugin-manifest.json";
import { handleManagePlugin } from "./manage-form";
import { handlePanelPlugin } from "./sidebar-panel";
import { handleFormFieldConfig } from "./field-config";

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
  (handler, _client, { getLanguage, getPluginSettings }) => {
    loadStyles();

    handler.on("flotiq.plugins.manage::form-schema", (data) =>
      handleManagePlugin(data, pluginInfo, getLanguage),
    );
    handler.on("flotiq.form.sidebar-panel::add", (data) =>
      handlePanelPlugin(data, pluginInfo, getPluginSettings),
    );
    handler.on("flotiq.form.field::config", (data) =>
      handleFormFieldConfig(data),
    );
  },
);
