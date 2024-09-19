import { FlipboxType, Trigger } from "./index";

export interface ClickEvent extends MouseEvent {
  fromFlipbox?: boolean;
}

export type ToggleActive = (
  node: HTMLDivElement,
  currentState: FlipboxType
) => void;

export type ChangeFlipboxState = (
  item: HTMLDivElement,
  currentState: FlipboxType,
  trigger: Trigger
) => FlipboxType;

export type ResetFlipboxState = (item: HTMLDivElement) => void;

export type IncreaseFlipboxHeight = (item: HTMLDivElement) => void;
