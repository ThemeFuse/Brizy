import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Tel extends TextField {
  static get componentTitle() {
    return t("Tel");
  }

  static get componentType() {
    return "Tel";
  }

  static pattern = "[0-9()#&+*-=.]+";
}
