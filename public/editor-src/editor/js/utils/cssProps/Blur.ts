import { NewType } from "visual/types/NewType";
import { mPipe, pass } from "visual/utils/fp";
import { Append } from "visual/utils/types/Monoid";

enum blur {
  blur = "blur"
}

export type Blur = NewType<number, blur.blur>;

export const is = (n: number): n is Blur => n >= 0;

export const fromNumber = mPipe(pass(is));

export const unsafe = (n: number): Blur => n as Blur;

export const empty: Blur = 0 as Blur;

export const append: Append<Blur> = (a, b) => a || b;
