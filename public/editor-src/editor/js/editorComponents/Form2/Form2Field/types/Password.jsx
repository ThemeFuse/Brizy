import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Password extends TextField {
  static get componentTitle() {
    return t("Password");
  }

  static get componentType() {
    return "Password";
  }
}
