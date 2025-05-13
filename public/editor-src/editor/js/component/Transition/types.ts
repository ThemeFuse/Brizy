import { JSX } from "react";

export enum TransitionPhase {
  APPEAR = "appear",
  APPEAR_ACTIVE = "appearActive",
  APPEAR_DONE = "appearDone",
  ENTER = "enter",
  ENTER_ACTIVE = "enterActive",
  ENTER_DONE = "enterDone",
  EXIT = "exit",
  EXIT_ACTIVE = "exitActive",
  EXIT_DONE = "exitDone"
}

export enum TransitionPhaseEvent {
  ENTER = "onEnter",
  ENTERING = "onEntering",
  ENTERED = "onEntered",
  EXIT = "onExit",
  EXITING = "onExiting",
  EXITED = "onExited"
}

export type TransitionState = {
  [key in TransitionPhase]: boolean;
};

export type TransitionProps = {
  [key in TransitionPhaseEvent]?: () => void;
} & {
  in?: boolean;
  appear?: boolean;
  enter?: boolean;
  exit?: boolean;
  duration?: number;
  alwaysMounted?: boolean;
  addEndListener?: (phase: TransitionPhase, done: () => void) => void;
  children:
    | JSX.Element
    | ((
        transitionState: TransitionState,
        activePhase: TransitionPhase
      ) => JSX.Element);
};
