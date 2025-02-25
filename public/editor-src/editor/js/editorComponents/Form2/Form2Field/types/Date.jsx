import { makeDataAttr } from "visual/utils/i18n/attribute";
import TextField from "./common/TextField";

export default class Date extends TextField {
  static get componentType() {
    return "Date";
  }

  getAttributes() {
    const { min, max, nativeHtml } = this.props;

    return {
      ...makeDataAttr({ name: "min", value: min }),
      ...makeDataAttr({ name: "native", value: max }),
      ...makeDataAttr({ name: "native", value: String(nativeHtml === "on") })
    };
  }
}
