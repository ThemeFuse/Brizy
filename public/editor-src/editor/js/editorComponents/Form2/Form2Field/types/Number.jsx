import { makeDataAttr } from "visual/utils/i18n/attribute";
import { encodeToString } from "visual/utils/string";
import TextField from "./common/TextField";

export default class Number extends TextField {
  static get componentType() {
    return "Number";
  }

  static pattern = "^-?[0-9]\\d*(\\.\\d+)?$";

  getAttributes() {
    const { min, max, error } = this.props;

    return {
      ...makeDataAttr({ name: "min", value: min }),
      ...makeDataAttr({ name: "max", value: max }),
      ...makeDataAttr({
        name: "error",
        value: encodeToString(error)
      })
    };
  }
}
