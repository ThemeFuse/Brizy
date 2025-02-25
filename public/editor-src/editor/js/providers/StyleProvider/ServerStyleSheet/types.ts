import { Sheet } from "../Sheet";

export interface ServerStyle {
  instance: Readonly<Sheet>;
  getStyles(): Array<{ className: string; cssText: string }>;
  purge(): void;
}
