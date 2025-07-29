import { defaultValueValue } from "visual/utils/onChange";
import { DESKTOP, ResponsiveMode } from "visual/utils/responsiveMode";
import EditorComponent from "../EditorComponent";
import defaultValue from "./defaultValue.json";
import { Value } from "./types";

export class BaseTwitter extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;
  isUnMounted = false;
  currentDeviceMode: ResponsiveMode = DESKTOP;

  static get componentId(): "Twitter" {
    return "Twitter";
  }
  dvv = (key: string): string => {
    const v = this.getValue();
    const device = this.getDeviceMode();

    return defaultValueValue({ v, key, device });
  };
}
