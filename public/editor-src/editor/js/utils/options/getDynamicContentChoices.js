import _ from "underscore";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";

function getUnsetChoiceTitle(type) {
  switch (type) {
    case "richText":
      return t("Custom text");
    case "image":
      return t("Custom image");
    case "link":
      return t("Custom link");
    default:
      return t("Custom");
  }
}

export const getDynamicContentChoices = (
  type,
  addUnsetChoice = false,
  unsetChoiceTitle
) => {
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
    ? addUnsetChoice
      ? [
          { title: unsetChoiceTitle ?? getUnsetChoiceTitle(type), value: "" },
          ...choices
        ]
      : choices
    : [];
};
