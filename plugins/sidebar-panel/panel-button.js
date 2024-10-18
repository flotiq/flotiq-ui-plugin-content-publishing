import { cachedPublicVersions } from "../../common/api-helpers";
import { deepReadKeyValue } from "../../common/helpers";

const getPath = (routeTemplate, object) => {
  const path = routeTemplate.replace(/{(?<key>[^{}]+)}/g, (...params) => {
    const { key } = params[4];
    return deepReadKeyValue(key, object);
  });
  return `/${path.replace(/^\/+/, "")}`;
};

const onPreviewClick = async (
  event,
  element,
  baseURLInstance,
  routeTemplate,
  formik,
  create,
) => {
  event.preventDefault();

  let error = false;
  let formikResponse;

  if (create || formik.dirty) {
    element.classList.add("plugin-preview-links__link--loading");
    formikResponse = await formik.submitForm();
    error = !formikResponse || Object.keys(formikResponse?.[1] || {}).length;
    element.classList.remove("plugin-preview-links__link--loading");
  }

  if (!error) {
    const path = getPath(routeTemplate, formikResponse?.[0] || formik.values);

    baseURLInstance.searchParams.set("draft", "true");
    baseURLInstance.searchParams.set("redirect", path);

    window.open(baseURLInstance);
  }
};

const onPublicClick = async (
  event,
  element,
  publicVersionPromise,
  baseURLInstance,
  routeTemplate,
) => {
  event.preventDefault();

  if (!publicVersionPromise) {
    return;
  }

  try {
    element.classList.add("plugin-preview-links__link--loading");
    const publicVersion = await publicVersionPromise;
    element.classList.remove("plugin-preview-links__link--loading");

    const path = getPath(routeTemplate, publicVersion);

    baseURLInstance.searchParams.set("draft", "false");
    baseURLInstance.searchParams.set("redirect", path);

    window.open(baseURLInstance);
  } catch (e) {
    console.error(e);
    return;
  }
};

const generateURL = (parsedSettings) => {
  const url = new URL(
    `${parsedSettings.base_url.replace(/\/+$/, "")}/api/flotiq/draft`,
  );
  url.searchParams.set("key", parsedSettings.editor_key);
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
  const baseURLInstance = generateURL(parsedSettings);

  const previewLink = htmlElement.querySelector(
    ".plugin-preview-links__preview-link",
  );
  const publicLink = htmlElement.querySelector(
    ".plugin-preview-links__public-link",
  );

  previewLink.onclick = (event) =>
    onPreviewClick(
      event,
      previewLink,
      baseURLInstance,
      buttonSettings.route_template,
      formik,
      create,
    );

  const type = contentObject?.internal?.contentType;
  const id = contentObject?.id;
  const publicVersionPromise = cachedPublicVersions?.[type]?.[id];

  if (!publicVersionPromise) {
    publicLink.classList.add("plugin-preview-links__link--disabled");
  } else publicLink.classList.remove("plugin-preview-links__link--disabled");

  publicLink.onclick = (event) =>
    onPublicClick(
      event,
      publicLink,
      publicVersionPromise,
      baseURLInstance,
      buttonSettings.route_template,
    );
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
