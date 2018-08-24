import _ from "underscore";
import Config from "visual/global/Config";

const dynamicContent = Config.get("dynamicContent");

export const getDynamicContentByPlaceholder = (type, placeholder) =>
  _
    .flatten(_.values(dynamicContent[type]), true)
    .find(item => item.placeholder === placeholder);
