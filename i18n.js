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
        Preview: "Preview",
        PreviewAndSave: "Preview and save draft",
        PublicVersion: "Public version",
        RouteTemplate: "Page route template",
        SaveAndView: "Save and view",
        UrlTemplate: "URL template",
        View: "View",
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
        Preview: "Podgląd",
        PreviewAndSave: "Zapis szkicu i podgląd",
        PublicVersion: "Wersja publiczna",
        RouteTemplate: "Szablon ścieżki do strony",
        SaveAndView: "Zapis i podgląd",
        UrlTemplate: "Szablon adresu URL",
        View: "Podgląd",
      },
    },
  },
});

export default i18n;
