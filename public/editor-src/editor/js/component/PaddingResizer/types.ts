import { RenderType } from "visual/providers/RenderProvider";

export interface Value {
  paddingType: string;
  padding: number;
  paddingTop: number;
  paddingBottom: number;

  tabletPaddingType: string;
  tabletPadding: number;
  tabletPaddingTop: number;
  tabletPaddingBottom: number;

  mobilePaddingType: string;
  mobilePadding: number;
  mobilePaddingTop: number;
  mobilePaddingBottom: number;
}

export interface Props {
  value: Value;
  onChange: (t: Partial<Value>) => void;
  onStart: VoidFunction;
  onEnd: VoidFunction;
  renderContext: RenderType;
}

export interface DragInfo {
  deltaY: number;
}
