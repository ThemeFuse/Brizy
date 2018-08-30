import _ from "underscore";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";

export const getDynamicContentChoices = type => {
  const dynamicContent = Config.get("dynamicContent");

  if (!dynamicContent) {
    return [];
  }

  const choices = _.flatten(_.values(dynamicContent[type]), true).map(
    ({ label, placeholder }) => ({
      title: label,
      value: placeholder
    })
  );

  return choices.length > 0
    ? choices
    : [{ title: t("No matches found"), value: "" }];
};
