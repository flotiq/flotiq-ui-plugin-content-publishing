import {
  addElementToCache,
  getCachedElement,
} from "../../common/plugin-element-cache";
import { createLinksItem, updateLinkButtons } from "./panel-button";

const createPanelElement = (cacheKey) => {
  const panelElement = document.createElement("div");
  panelElement.classList.add("plugin-preview-links");
  panelElement.innerHTML = /*html*/ `
    <span class="plugin-preview-links__header">
      Preview
    </span>
    <div class="plugin-preview-links__button-list"></div>
  `;

  addElementToCache(panelElement, cacheKey);

  return panelElement;
};

const updatePanelElement = (
  pluginContainer,
  parsedSettings,
  settingsForCtd,
  contentObject,
  formik,
  create,
) => {
  const buttonList = pluginContainer.querySelector(
    ".plugin-preview-links__button-list",
  );

  settingsForCtd.forEach((buttonSettings, index) => {
    let htmlItem = buttonList.children[index];
    if (!htmlItem) {
      htmlItem = createLinksItem();
      buttonList.appendChild(htmlItem);
    }
    updateLinkButtons(
      htmlItem,
      parsedSettings,
      buttonSettings,
      contentObject,
      formik,
      create,
    );
    return htmlItem;
  });

  // Remove unnecessary items
  while (settingsForCtd.length < buttonList.children.length) {
    buttonList.children[buttonList.children.length - 1].remove();
  }
};

export const handlePanelPlugin = (
  { contentType, contentObject, create, formik },
  pluginInfo,
  getPluginSettings,
) => {
  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || "{}");

  if (
    (!contentObject && !create) ||
    !contentType?.name ||
    !parsedSettings ||
    !formik
  )
    return null;

  const settingsForCtd = parsedSettings.config?.filter(
    (plugin) =>
      plugin.content_types.length === 0 ||
      plugin.content_types.find((ctd) => ctd === contentType.name),
  );

  if (!settingsForCtd.length) return null;

  const cacheKey = `${pluginInfo.id}-${contentType.name}-${contentObject?.id || "new"}`;

  let pluginContainer = getCachedElement(cacheKey)?.element;

  if (!pluginContainer) {
    pluginContainer = createPanelElement(cacheKey);
  }

  updatePanelElement(
    pluginContainer,
    parsedSettings,
    settingsForCtd,
    contentObject,
    formik,
    create,
  );

  return pluginContainer;
};
