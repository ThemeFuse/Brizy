import _ from "underscore";
import Config from "visual/global/Config";

const dynamicContent = Config.get("dynamicContent");

export const getDynamicChoices = type => {
  if (!dynamicContent || !dynamicContent[type]) {
    return [];
  }

  const choices = _.flatten(_.values(dynamicContent[type]), true).map(
    ({ label, placeholder }) => ({
      title: label,
      value: placeholder
    })
  );

  return choices.length > 0 ? choices : [{ title: "-", value: "" }];
};
