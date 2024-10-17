import i18n from "i18next";

i18n.init({
  fallbackLng: "en",
  supportedLngs: ["en", "pl"],
  resources: {
    en: {
      translation: {
        BaseURL: "Page base URL",
        Config: "Links configuration",
        ContentTypes: "Content types",
        EditorKey: "Access authoriazation key",
        EditorKeyHelpText:
          "Key to view drafts and cache revalidation. It is defined in your application's environment variables",
        RouteTemplate: "Page route template",
        UrlTemplate: "URL template",
      },
    },
    pl: {
      translation: {
        BaseURL: "Podstawowy adres strony",
        ContentTypes: "Definicje typu",
        Config: "Konfiguracja linków",
        EditorKey: "Klucz autoryzujący dostęp",
        EditorKeyHelpText:
          "Klucz umożliwiający podgląd draftów i rewalidacji cache. " +
          "Jest on zdefiniowany w zmiennych środowiskowych Twojej aplikacji",
        RouteTemplate: "Szablon ścieżki do strony",
        UrlTemplate: "Szablon adresu URL",
      },
    },
  },
});

export default i18n;
