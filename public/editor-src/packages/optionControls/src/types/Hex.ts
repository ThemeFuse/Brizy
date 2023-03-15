import { NewType } from "./NewType";

enum hex {
  hex = "hex"
}

export type Hex = "#000000" | "#ffffff" | NewType<string, hex.hex>;
