import { makeDataAttr } from "visual/utils/i18n/attribute";
import TextField from "./common/TextField";

export default class Time extends TextField {
  static get componentType() {
    return "Time";
  }

  getAttributes() {
    const { min, max, nativeHtml } = this.props;
    return {
      ...makeDataAttr({ name: "min", value: min }),
      ...makeDataAttr({ name: "max", value: max }),
      ...makeDataAttr({ name: "native", value: String(nativeHtml === "on") })
    };
  }
}
