import { TransitionPhase, TransitionPhaseEvent } from "./types";

export const EVENT_MAP: {
  [key in TransitionPhase]: [TransitionPhaseEvent, TransitionPhase?, boolean?];
} = {
  [TransitionPhase.APPEAR]: [
    TransitionPhaseEvent.ENTER,
    TransitionPhase.APPEAR_ACTIVE
  ],
  [TransitionPhase.APPEAR_ACTIVE]: [
    TransitionPhaseEvent.ENTERING,
    TransitionPhase.APPEAR_DONE,
    true
  ],
  [TransitionPhase.APPEAR_DONE]: [TransitionPhaseEvent.ENTERED],
  [TransitionPhase.ENTER]: [
    TransitionPhaseEvent.ENTER,
    TransitionPhase.ENTER_ACTIVE
  ],
  [TransitionPhase.ENTER_ACTIVE]: [
    TransitionPhaseEvent.ENTERING,
    TransitionPhase.ENTER_DONE,
    true
  ],
  [TransitionPhase.ENTER_DONE]: [TransitionPhaseEvent.ENTERED],
  [TransitionPhase.EXIT]: [
    TransitionPhaseEvent.EXIT,
    TransitionPhase.EXIT_ACTIVE
  ],
  [TransitionPhase.EXIT_ACTIVE]: [
    TransitionPhaseEvent.EXITING,
    TransitionPhase.EXIT_DONE,
    true
  ],
  [TransitionPhase.EXIT_DONE]: [TransitionPhaseEvent.EXITED]
};
