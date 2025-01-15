import { t } from "visual/utils/i18n";

export const getApiKeys = () => [
  { name: "typekit", title: t("Web Project ID") }
];

export const getDefaultValue = () =>
  getApiKeys().reduce((acc, { name }) => ({ ...acc, [name]: "" }), {
    typekit: ""
  });
