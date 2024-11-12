import { Ref, ReactElement } from "react";
import { Settings as MotionSettings } from "@brizy/motion/es/types";

export interface ScrollAttr {
  "data-motion-scroll-blur"?: string;
  "data-motion-scroll-scale"?: string;
  "data-motion-scroll-rotate"?: string;
  "data-motion-scroll-transparency"?: string;
  "data-motion-scroll-vertical"?: string;
  "data-motion-scroll-horizontal"?: string;
}

export interface MouseAttr {
  "data-motion-mouse-track"?: string;
  "data-motion-mouse-fit"?: string;
}

export interface ResponsiveAttr {
  "data-motion-responsive"?: string;
}

export interface ScrollMotionsAttr {
  options: ScrollAttr & MouseAttr & ResponsiveAttr;
  class: "brz-motion--effects";
}

type FunctionAsAChild = (
  ref: Ref<HTMLElement | undefined>,
  attr?: ScrollMotionsAttr
) => ReactElement;
export interface ScrollMotionsProps {
  className?: string;
  options?: MotionSettings;
  children: ReactElement | FunctionAsAChild;
  needWrapper?: boolean;
}

export type ScrollMotionAttr = ScrollAttr & MouseAttr & ResponsiveAttr;
