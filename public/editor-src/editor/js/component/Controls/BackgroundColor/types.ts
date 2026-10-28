import type { WithClassName, WithValue } from "visual/types/attributes";
import type { PaletteObject } from "../ColorPalette/entities/PaletteObject";
import type { Meta, Value } from "./entities";

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
