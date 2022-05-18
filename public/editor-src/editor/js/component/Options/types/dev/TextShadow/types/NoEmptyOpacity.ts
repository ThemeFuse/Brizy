import { NewType } from "visual/types/NewType";
import { Opacity, empty } from "visual/utils/cssProps/opacity";

enum noEmptyOpacity {
  noEmptyOpacity = "noEmptyOpacity"
}

export type NoEmptyOpacity = NewType<number, noEmptyOpacity.noEmptyOpacity>;

export const fromOpacity = (v: Opacity): NoEmptyOpacity | undefined =>
  v !== empty ? ((v as number) as NoEmptyOpacity) : undefined;

export const toOpacity = (v: NoEmptyOpacity): Opacity =>
  (v as number) as Opacity;
