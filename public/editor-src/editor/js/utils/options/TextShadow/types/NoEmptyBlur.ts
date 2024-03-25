import { NewType } from "visual/types/NewType";
import { Blur, empty } from "visual/utils/cssProps/Blur";

enum noEmptyBlur {
  noEmptyBlur = "noEmptyBlur"
}

export type NoEmptyBlur = NewType<number, noEmptyBlur.noEmptyBlur>;

export const fromBlur = (v: Blur): NoEmptyBlur | undefined =>
  v !== empty ? ((v as number) as NoEmptyBlur) : undefined;

export const toBlur = (v: NoEmptyBlur): Blur => (v as number) as Blur;
