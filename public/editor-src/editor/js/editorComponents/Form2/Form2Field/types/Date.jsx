import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Date extends TextField {
  static get componentTitle() {
    return t("Date");
  }

  static get componentType() {
    return "Date";
  }

  getAttributes() {
    const { min, max, nativeHtml } = this.props;

    return {
      "data-min": min,
      "data-max": max,
      "data-native": nativeHtml === "on"
    };
  }
}
