import i18n from "../../i18n";
import pluginInfo from "../../plugin-manifest.json";

export const getSchema = (contentTypes) => ({
  id: pluginInfo.id,
  name: "publishing_links",
  label: "Publishing links",
  internal: false,
  schemaDefinition: {
    type: "object",
    allOf: [
      {
        $ref: "#/components/schemas/AbstractContentTypeSchemaDefinition",
      },
      {
        type: "object",
        properties: {
          base_url: {
            type: "string",
            minLength: 1,
            pattern: "",
          },
          editor_key: {
            type: "string",
            minLength: 1,
          },
          config: {
            type: "array",
            items: {
              type: "object",
              required: ["content_types", "route_template"],
              properties: {
                route_template: {
                  type: "string",
                  minLength: 1,
                },
                content_types: {
                  type: "array",
                },
              },
            },
            minItems: 1,
          },
        },
      },
    ],
    required: ["base_url", "editor_key"],
    additionalProperties: false,
  },
  metaDefinition: {
    order: ["base_url", "editor_key", "config"],
    propertiesConfig: {
      base_url: {
        label: i18n.t("BaseURL"),
        helpText: "",
        unique: false,
        inputType: "text",
      },
      editor_key: {
        label: i18n.t("EditorKey"),
        helpText: i18n.t("EditorKeyHelpText"),
        unique: false,
        inputType: "text",
      },
      config: {
        items: {
          order: ["content_types", "route_template"],
          propertiesConfig: {
            content_types: {
              label: i18n.t("ContentTypes"),
              unique: false,
              helpText: "",
              inputType: "select",
              isMultiple: true,
              useOptionsWithLabels: true,
              optionsWithLabels: contentTypes,
            },
            route_template: {
              label: i18n.t("RouteTemplate"),
              unique: false,
              helpText: "",
              inputType: "text",
            },
          },
        },
        label: i18n.t("Config"),
        unique: false,
        helpText: "",
        inputType: "object",
      },
    },
  },
});
