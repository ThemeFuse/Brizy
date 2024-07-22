import { JSXElementConstructor } from "react";
import { EffectProps } from "visual/utils/options/Motion/types/EffectProps";
import { MouseTilt as V } from "visual/utils/options/Motion/types/MouseTilt";
import { MouseTrack } from "./MouseTrack";

export const Tilt: JSXElementConstructor<EffectProps<V>> = MouseTrack;
