import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Text extends TextField {
  static get componentTitle() {
    return t("Text");
  }

  static get componentType() {
    return "Text";
  }
}
