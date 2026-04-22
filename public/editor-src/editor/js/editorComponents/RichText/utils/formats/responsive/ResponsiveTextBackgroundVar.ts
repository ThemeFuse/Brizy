import Quill from "quill";

const Parchment = Quill.import("parchment");

class ResponsiveTextBackgroundVar extends Parchment.Attributor.Style {
  constructor(
    keyName: string,
    value: string,
    options: Record<string, unknown>,
    device: string
  ) {
    super(keyName, value, options);
    this.device = device;
  }

  add(node: HTMLElement, value: string) {
    if (!this.canAdd(node, value)) return false;

    if (value) {
      node.style.setProperty(this.keyName, value);
      node.setAttribute(`data-background-color-${this.device}-var`, this.keyName);
    } else {
      node.style.removeProperty(this.keyName);
      node.removeAttribute(`data-background-color-${this.device}-var`);
    }

    return true;
  }

  remove(node: HTMLElement) {
    node.style.removeProperty(this.keyName);
    node.removeAttribute(`data-background-color-${this.device}-var`);
  }

  value(node: HTMLElement) {
    const value = node.style.getPropertyValue(this.keyName);
    return this.canAdd(node, value) ? value : "";
  }
}

const BackgroundTabletVar = new ResponsiveTextBackgroundVar(
  "tabletBackground",
  "--brz-text-sm-background-color",
  { scope: Parchment.Scope.INLINE },
  "tablet"
);

const BackgroundMobileVar = new ResponsiveTextBackgroundVar(
  "mobileBackground",
  "--brz-text-xs-background-color",
  { scope: Parchment.Scope.INLINE },
  "mobile"
);

export { BackgroundTabletVar, BackgroundMobileVar };
