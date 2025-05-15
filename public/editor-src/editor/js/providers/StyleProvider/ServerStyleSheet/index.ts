import { Sheet } from "../Sheet";
import { ServerStyle } from "./types";

export class ServerStyleSheet implements ServerStyle {
  readonly instance: Readonly<Sheet>;

  constructor(doc?: Document) {
    this.instance = Object.freeze(new Sheet(doc));
  }

  getStyles() {
    return this.instance.getStyles();
  }

  purge() {
    this.instance.purge();
  }
}
