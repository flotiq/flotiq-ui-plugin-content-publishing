import { deepReadKeyValue } from "../../common/helpers";

const onLinkClick = async (event, element) => {
  event.preventDefault();

  element.classList.add("plugin-preview-links__link--loading");
  await new Promise((r) => setTimeout(r, 1000));
  element.classList.remove("plugin-preview-links__link--loading");

  const url = event.target.href;
  window.open(url);
};

const generateURL = (parsedSettings, path, isDraft) =>
  `${parsedSettings.base_url}/api/flotiq/` +
  `drat?draft=${isDraft}&key=${parsedSettings.editor_key}&redirect=${path}`;

export const updateLinkButtons = (
  htmlElement,
  parsedSettings,
  buttonSettings,
  contentObject,
) => {
  const path = buttonSettings.route_template.replace(
    /{(?<key>[^{}]+)}/g,
    (...params) => {
      const { key } = params[4];
      return deepReadKeyValue(key, contentObject);
    },
  );

  const previewLink = htmlElement.querySelector(
    ".plugin-preview-links__preview-link",
  );
  const publicLink = htmlElement.querySelector(
    ".plugin-preview-links__public-link",
  );

  previewLink.href = generateURL(parsedSettings, path, true);
  publicLink.href = generateURL(parsedSettings, path, false);

  previewLink.onclick = (event) => onLinkClick(event, previewLink);
  publicLink.onclick = (event) => onLinkClick(event, publicLink);
};

export const createLinksItem = () => {
  const containerItem = document.createElement("div");
  containerItem.classList.add("plugin-preview-links__item");

  containerItem.innerHTML = /* html */ `
    <a class="plugin-preview-links__link plugin-preview-links__preview-link">
        Preview and save draft
    </a>
    <a class="plugin-preview-links__link plugin-preview-links__public-link">
        Public version
    </a>
  `;

  return containerItem;
};
