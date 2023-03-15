import { t } from "visual/utils/i18n";
import TextField from "./common/TextField";

export default class Url extends TextField {
  static get componentTitle() {
    return t("URL");
  }

  static get componentType() {
    return "Url";
  }

  static pattern =
    "(http(s)?:\\/\\/.)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&\\/=]*)";
}
