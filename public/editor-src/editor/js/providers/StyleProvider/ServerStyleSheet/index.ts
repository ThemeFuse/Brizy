import { Sheet } from "../Sheet";
import { ServerStyle } from "./types";

export class ServerStyleSheet implements ServerStyle {
  readonly instance: Sheet;

  constructor() {
    this.instance = Object.freeze(new Sheet());
  }

  getStyles() {
    return this.instance.getStyles();
  }

  purge() {
    this.instance.purge();
  }
}
