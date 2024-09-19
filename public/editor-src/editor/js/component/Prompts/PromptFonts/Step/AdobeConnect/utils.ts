import { t } from "visual/utils/i18n";

export const apiKeys = [{ name: "typekit", title: t("Web Project ID") }];

export const getDefaultValue = () =>
  apiKeys.reduce((acc, { name }) => ({ ...acc, [name]: "" }), {
    typekit: ""
  });
