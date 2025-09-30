const loadingClass = "plugin-preview-links__link--loading";
let tabRef = null;

const openLink = (url) => {
  if (tabRef && !tabRef.closed) {
    tabRef.location.replace(url);
    tabRef.focus();
    return;
  }

  tabRef = window.open(url, "_blank");
  tabRef.focus();
};

const toogleLoading = (element, isLoading) => {
  if (isLoading) element.classList.add(loadingClass);
  else element.classList.remove(loadingClass);
};

export const onPreviewClick = async (
  element,
  urlGenerator,
  form,
  create,
  isDraft,
) => {
  let error = false;
  let formikResponse;

  if (create || form.dirty) {
    toogleLoading(element, true);
    formikResponse = await form.submitForm();
    error = !formikResponse || Object.keys(formikResponse?.[1] || {}).length;
    toogleLoading(element, false);
  }

  if (!error) {
    const url = urlGenerator.getURL(
      formikResponse?.[0] || form.getValues(),
      isDraft,
    );
    openLink(url);
  }
};

export const onPublicClick = async (
  element,
  publicVersionPromise,
  urlGenerator,
) => {
  if (!publicVersionPromise) {
    return;
  }

  try {
    toogleLoading(element, true);
    const publicVersion = await publicVersionPromise;
    toogleLoading(element, false);

    const url = urlGenerator.getURL(publicVersion, false);
    openLink(url);
  } catch (e) {
    console.error(e);
    return;
  }
};
