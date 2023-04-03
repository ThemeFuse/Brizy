import { Handle } from "rc-slider";
import { ComponentProps, ReactNode, CSSProperties } from "react";

export interface Props {
  min?: number;
  max?: number;
  step?: number;
  startPointer: number;
  finishPointer: number;
  railStyle?: CSSProperties;
  handle?: (props: HandleProps) => ReactNode;
  onChange: (value: number[]) => void;
  className?: string;
}

export type HandleProps = ComponentProps<typeof Handle> & {
  index: number;
  dragging: boolean;
};
