import Quill from "quill";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { encodeToString, parseFromString } from "visual/utils/string";
import { getStyle } from "../BackgroundGradient";

const Parchment = Quill.import("parchment");

class ResponsiveBackgroundGradientVar extends Parchment.Attributor.Style {
  constructor(
    keyName: string,
    value: string,
    options: Record<string, unknown>,
    device: string,
    getConfig: GetConfig
  ) {
    super(keyName, value, options);
    this.device = device;
    this.getConfig = getConfig;
  }

  add(node: HTMLElement, value: string) {
    if (!this.canAdd(node, value)) return false;

    if (value) {
      const gradient = getStyle(value, this.getConfig());

      const encodedValue = encodeToString(value);

      node.style.setProperty(this.keyName, gradient);
      node.setAttribute(`data-gradient-color-${this.device}-var`, encodedValue);
    } else {
      node.style.removeProperty(this.keyName);
      node.removeAttribute(`data-gradient-color-${this.device}-var`);
    }

    return true;
  }

  remove(node: HTMLElement) {
    node.style.removeProperty(this.keyName);
    node.removeAttribute(`data-gradient-color-${this.device}-var`);
  }

  value(node: HTMLElement) {
    const value = node.getAttribute(`data-gradient-color-${this.device}-var`);

    if (!value) return "";

    return parseFromString(value);
  }
}

export const getBackgroundGradientTabletVar = (getConfig: GetConfig) =>
  new ResponsiveBackgroundGradientVar(
    "tabletBackgroundGradient",
    "--brz-text-sm-background-image",
    { scope: Parchment.Scope.INLINE },
    "tablet",
    getConfig
  );

export const getBackgroundGradientMobileVar = (getConfig: GetConfig) =>
  new ResponsiveBackgroundGradientVar(
    "mobileBackgroundGradient",
    "--brz-text-xs-background-image",
    { scope: Parchment.Scope.INLINE },
    "mobile",
    getConfig
  );
