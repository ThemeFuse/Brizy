import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Time extends TextField {
  static get componentTitle() {
    return t("Time");
  }

  static get componentType() {
    return "Time";
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
