import { Sheet } from "../Sheet";
import { ServerStyle } from "./types";

export class ServerStyleSheet implements ServerStyle {
  readonly instance: Readonly<Sheet>;

  constructor({ doc, instanceId }: { doc?: Document; instanceId?: string } = {}) {
    this.instance = Object.freeze(new Sheet({ doc, instanceId }));
  }

  getStyles() {
    return this.instance.getStyles();
  }

  purge() {
    this.instance.purge();
  }
}
