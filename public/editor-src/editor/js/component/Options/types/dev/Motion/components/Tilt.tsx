import { JSXElementConstructor } from "react";
import { MouseTilt as V } from "../types/MouseTilt";
import { EffectProps } from "../types/EffectProps";
import { MouseTrack } from "./MouseTrack";

export const Tilt: JSXElementConstructor<EffectProps<V>> = MouseTrack;
