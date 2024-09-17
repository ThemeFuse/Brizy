import { t } from "visual/utils/i18n";

export const apiKeys = [{ name: "typekit", title: t("Typekit Key") }];

export const getDefaultValue = () =>
  apiKeys.reduce((acc, { name }) => ({ ...acc, [name]: "" }), {
    typekit: ""
  });
