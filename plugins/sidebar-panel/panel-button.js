import i18n from "../../i18n";
import { onPreviewClick, onPublicClick } from "./link-actions";
import { URLGenerator } from "./URLGenerator";
import previewIcon from "inline:../../images/preview-icon.svg";
import publicIcon from "inline:../../images/public-icon.svg";

export const updateLinks = (
  htmlElement,
  config,
  formik,
  create,
  contentObject,
  publicVersionPromise,
) => {
  const urlGenerator = new URLGenerator(config);

  const previewLink = htmlElement.querySelector(
    ".plugin-preview-links__preview-link",
  );
  const publicLink = htmlElement.querySelector(
    ".plugin-preview-links__public-link",
  );

  if (create || formik.dirty) {
    previewLink.querySelector("span").textContent = i18n.t(
      publicLink ? "PreviewAndSave" : "SaveAndView",
    );
  } else {
    previewLink.querySelector("span").textContent = i18n.t(
      publicLink ? "Preview" : "View",
    );
  }

  previewLink.href = urlGenerator.getURL(contentObject, !!publicLink);

  previewLink.onclick = (event) => {
    event.preventDefault();
    onPreviewClick(previewLink, urlGenerator, formik, create, !!publicLink);
  };

  if (!publicLink) return;

  publicLink.querySelector("span").textContent = i18n.t("PublicVersion");

  if (!publicVersionPromise) {
    publicLink.classList.add("plugin-preview-links__link--disabled");
  } else {
    publicLink.classList.remove("plugin-preview-links__link--disabled");
    publicVersionPromise.then((publicVersion) => {
      publicLink.href = urlGenerator.getURL(publicVersion, !!publicLink);
    });
  }

  publicLink.onclick = (event) => {
    event.preventDefault();
    onPublicClick(publicLink, publicVersionPromise, urlGenerator);
  };
};

export const createLinks = (isPublishingWorkflow) => {
  const containerItem = document.createElement("div");
  containerItem.classList.add("plugin-preview-links__item");

  if (isPublishingWorkflow) {
    containerItem.innerHTML = /* html */ `
    <a class="plugin-preview-links__link plugin-preview-links__preview-link">
        ${previewIcon}
        <span>Preview</span>
    </a>
    <a class="plugin-preview-links__link plugin-preview-links__public-link">
        ${publicIcon}
        <span>Public version</span>
    </a>
  `;
  } else {
    containerItem.classList.add("plugin-preview-links__generic");

    containerItem.innerHTML = /* html */ `
    <a class="plugin-preview-links__link plugin-preview-links__preview-link">
        ${previewIcon}
        <span>View</span>
    </a>
  `;
  }

  return containerItem;
};
