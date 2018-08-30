import _ from "underscore";
import Config from "visual/global/Config";

export const getDynamicContentByPlaceholder = (type, placeholder) => {
  const dynamicContent = Config.get("dynamicContent");

  if (!dynamicContent || !dynamicContent[type]) {
    return undefined;
  }

  return _.flatten(_.values(dynamicContent[type]), true).find(
    item => item.placeholder === placeholder
  );
};
