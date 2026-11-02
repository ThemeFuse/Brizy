import type { JSXElementConstructor } from "react";
import type { EffectProps } from "visual/utils/options/Motion/types/EffectProps";
import type { MouseTilt as V } from "visual/utils/options/Motion/types/MouseTilt";
import { MouseTrack } from "./MouseTrack";

export const Tilt: JSXElementConstructor<EffectProps<V>> = MouseTrack;
