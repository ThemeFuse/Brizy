import Quill from "quill";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { encodeToString, parseFromString } from "visual/utils/string";
import { getStyle } from "../BackgroundGradient";

const Parchment = Quill.import("parchment");

class ResponsiveTextBackgroundGradientVar extends Parchment.Attributor.Style {
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
      node.setAttribute(
        `data-gradient-background-${this.device}-var`,
        encodedValue
      );
    } else {
      node.style.removeProperty(this.keyName);
      node.removeAttribute(`data-gradient-background-${this.device}-var`);
    }

    return true;
  }

  remove(node: HTMLElement) {
    node.style.removeProperty(this.keyName);
    node.removeAttribute(`data-gradient-background-${this.device}-var`);
  }

  value(node: HTMLElement) {
    const value = node.getAttribute(
      `data-gradient-background-${this.device}-var`
    );

    if (!value) return "";

    return parseFromString(value);
  }
}

export const getTextBackgroundGradientTabletVar = (getConfig: GetConfig) =>
  new ResponsiveTextBackgroundGradientVar(
    "tabletTextBackgroundGradient",
    "--brz-text-sm-text-background-image",
    { scope: Parchment.Scope.INLINE },
    "tablet",
    getConfig
  );

export const getTextBackgroundGradientMobileVar = (getConfig: GetConfig) =>
  new ResponsiveTextBackgroundGradientVar(
    "mobileTextBackgroundGradient",
    "--brz-text-xs-text-background-image",
    { scope: Parchment.Scope.INLINE },
    "mobile",
    getConfig
  );
