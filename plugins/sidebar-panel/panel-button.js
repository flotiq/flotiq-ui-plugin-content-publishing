import { onPreviewClick, onPublicClick } from "./link-actions";
import { URLGenerator } from "./URLGenerator";

export const updateLinks = (
  htmlElement,
  config,
  formik,
  create,
  publicVersionPromise,
) => {
  const urlGenerator = new URLGenerator(config);

  const previewLink = htmlElement.querySelector(
    ".plugin-preview-links__preview-link",
  );
  const publicLink = htmlElement.querySelector(
    ".plugin-preview-links__public-link",
  );

  previewLink.href = urlGenerator.getURL(formik.initialValues, !!publicLink);

  previewLink.onclick = (event) => {
    event.preventDefault();
    onPreviewClick(previewLink, urlGenerator, formik, create, !!publicLink);
  };

  if (!publicLink) return;

  if (!publicVersionPromise) {
    publicLink.classList.add("plugin-preview-links__link--disabled");
    publicVersionPromise.then((publicVersion) => {
      publicLink.href = urlGenerator.getURL(publicVersion, !!publicLink);
    });
  } else publicLink.classList.remove("plugin-preview-links__link--disabled");

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
        Preview and save draft
    </a>
    <a class="plugin-preview-links__link plugin-preview-links__public-link">
        Public version
    </a>
  `;
  } else {
    containerItem.innerHTML = /* html */ `
    <a class="plugin-preview-links__link plugin-preview-links__preview-link">
      Save and view
    </a>
  `;
  }

  return containerItem;
};
