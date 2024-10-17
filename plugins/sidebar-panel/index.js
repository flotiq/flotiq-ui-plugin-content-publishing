import {
  addElementToCache,
  getCachedElement,
} from "../../common/plugin-element-cache";
import { createLinksItem, updateLinkButtons } from "./panel-button";

// const onClick = (e) => {
//   e.preventDefault();
//   const url = e.target.href;
//   window.open(url, "_blank");
// };

// const generateLink = (parsedSettings, path, isDraft) => {
//   const url =
//     `${parsedSettings.base_url}/api/flotiq/` +
//     `drat?draft=${isDraft}&key=${parsedSettings.editorKey}&redirect=${path}`;

//   const link = document.createElement("a");
//   link.setAttribute("class", "link-button");
//   link.setAttribute("href", url);

//   const span = document.createElement("span");
//   span.textContent = isDraft ? "Preview and save draft" : "Public version";

//   link.appendChild(span);
//   link.addEventListener("click", onClick);

//   return link;
// };

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
    updateLinkButtons(htmlItem, parsedSettings, buttonSettings, contentObject);
    return htmlItem;
  });

  // Remove unnecessary items
  while (settingsForCtd.length < buttonList.children.length) {
    buttonList.children[buttonList.children.length - 1].remove();
  }
};

export const handlePanelPlugin = (
  { contentType, contentObject, duplicate, create },
  pluginInfo,
  getPluginSettings,
) => {
  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || "{}");

  if (
    !contentObject ||
    !contentType?.name ||
    create ||
    duplicate ||
    !parsedSettings
  )
    return null;

  const settingsForCtd = parsedSettings.config?.filter(
    (plugin) =>
      plugin.content_types.length === 0 ||
      plugin.content_types.find((ctd) => ctd === contentType.name),
  );

  if (!settingsForCtd.length) return null;

  const cacheKey = `${pluginInfo.id}-${contentType.name}-${contentObject.id}`;

  let pluginContainer = getCachedElement(cacheKey)?.element;

  if (!pluginContainer) {
    pluginContainer = createPanelElement(cacheKey);
  }

  updatePanelElement(
    pluginContainer,
    parsedSettings,
    settingsForCtd,
    contentObject,
  );

  return pluginContainer;
};
