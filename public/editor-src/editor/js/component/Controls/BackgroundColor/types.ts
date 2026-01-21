import { WithClassName } from "visual/types/attributes";
import { WithValue } from "visual/types/attributes";
import { PaletteObject } from "../ColorPalette/entities/PaletteObject";
import { Meta, Value } from "./entities";

export type Props = WithClassName &
  WithValue<Value> & {
    onChange: (v: Value, m: Meta) => void;
    paletteOpenSettings?: () => void;
    palette?: PaletteObject[];
    opacity: boolean;
    gradientColors: [string, string];
    withNone: boolean;
    withAnimatedGradient: boolean;
  };
