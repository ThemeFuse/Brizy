import { t } from "visual/utils/i18n";

export const getApiKeys = () => [
  { name: "typekit", title: t("Web Project ID") }
];

export const getDefaultValue = () =>
  getApiKeys().reduce<Record<string, string>>(
    (acc, { name }) => {
      acc[name] = "";
      return acc;
    },
    { typekit: "" }
  );
