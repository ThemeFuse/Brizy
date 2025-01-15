import { Sheet } from "../Sheet";

export interface ServerStyle {
  instance: Sheet;
  getStyles(): Array<{ className: string; cssText: string }>;
  purge(): void;
}
