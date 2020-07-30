import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Number extends TextField {
  static get componentTitle() {
    return t("Number");
  }

  static get componentType() {
    return "Number";
  }

  static pattern = "^-?[0-9]\\d*(\\.\\d+)?$";

  getAttributes() {
    const { min, max } = this.props;

    return {
      "data-min": min,
      "data-max": max
    };
  }
}
