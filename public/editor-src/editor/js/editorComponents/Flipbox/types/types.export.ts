import { FlipboxType } from "visual/editorComponents/Flipbox/types";

export interface ClickEvent extends MouseEvent {
  fromFlipbox?: boolean;
}

export type ToggleActive = (
  node: HTMLDivElement,
  currentState: FlipboxType
) => void;

export type ChangeFlipboxState = (
  item: HTMLDivElement,
  currentState: FlipboxType
) => FlipboxType;

export type ResetFlipboxState = (item: HTMLDivElement) => void;

export type IncreaseFlipboxHeight = (item: HTMLDivElement) => void;
