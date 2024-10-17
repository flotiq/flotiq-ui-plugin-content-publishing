import { deepReadKeyValue } from "../../common/helpers";

const onPreviewClick = async (event, element, formik, create) => {
  event.preventDefault();

  let error = false;

  if (create || formik.dirty) {
    element.classList.add("plugin-preview-links__link--loading");
    const formikResponse = await formik.submitForm();
    error = !formikResponse || Object.keys(formikResponse?.[1] || {}).length;
    element.classList.remove("plugin-preview-links__link--loading");
  }

  if (!error) {
    const url = event.target.href;
    window.open(url);
  }
};

const onPublicClick = (event, publicDisabled) => {
  event.preventDefault();

  if (publicDisabled) {
    return;
  }
  const url = event.target.href;
  window.open(url);
};

const generateURL = (parsedSettings, path, draftParam) => {
  const url = new URL(`${parsedSettings.base_url}/api/flotiq/draft`);
  url.searchParams.set("draft", draftParam);
  url.searchParams.set("key", parsedSettings.editor_key);
  url.searchParams.set("redirect", path);
  return url;
};

export const updateLinkButtons = (
  htmlElement,
  parsedSettings,
  buttonSettings,
  contentObject,
  formik,
  create,
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

  previewLink.href = generateURL(parsedSettings, path, "true");
  publicLink.href = generateURL(parsedSettings, path, "false");

  previewLink.onclick = (event) =>
    onPreviewClick(event, previewLink, formik, create);

  const publicDisabled =
    !contentObject?.internal?.workflowPublicVersion ||
    contentObject?.internal?.workflowPublicVersion < 0;

  if (publicDisabled)
    publicLink.classList.add("plugin-preview-links__link--disabled");
  else publicLink.classList.remove("plugin-preview-links__link--disabled");

  publicLink.onclick = (event) => onPublicClick(event, publicDisabled);
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
