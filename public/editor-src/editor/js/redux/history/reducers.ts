import {
  Reducer,
  UnknownDict,
  HistoryEnhancerState,
  HistoryEnhancerConfig,
  UNDO,
  REDO,
  History
} from "./types";
import { hasProps } from "visual/utils/object";

export function createHistorySnapshot<
  T extends UnknownDict,
  StateKey extends keyof T
>(state: T, keys: StateKey[]): { [k in StateKey]: T[k] } {
  return keys.reduce((acc, key) => {
    acc[key] = state[key];
    return acc;
  }, {} as { [k in StateKey]: T[k] });
}

export function addHistoryDataToState<T extends UnknownDict, K extends keyof T>(
  state: T,
  history: History<{ [k in K]: T[k] }>
): T & {
  history: {
    currSnapshot: { [k in K]: T[k] } | null;
    prevSnapshot: { [k in K]: T[k] } | null;
    canUndo: boolean;
    canRedo: boolean;
  };
} {
  return {
    ...state,
    history: {
      currSnapshot: history.getCurrentSnapshot(),
      prevSnapshot: history.getPreviousSnapshot(),
      canUndo: history.canUndo(),
      canRedo: history.canRedo()
    }
  };
}

export function isHistoryEnhancedState<
  State extends UnknownDict,
  TrackedKeys extends keyof State
>(s: State): s is HistoryEnhancerState<State, TrackedKeys> {
  return (
    typeof s.history === "object" &&
    s.history !== null &&
    hasProps(["currSnapshot", "prevSnapshot", "canUndo", "canRedo"], s.history)
  );
}

export function historyReducerEnhancer<
  State extends UnknownDict,
  Action extends { type: string; meta?: { historyReplacePresent?: boolean } },
  TrackedKeys extends keyof State
>(
  reducer: Reducer<State, Action>,
  config: HistoryEnhancerConfig<State, TrackedKeys>
): Reducer<HistoryEnhancerState<State, TrackedKeys>, Action> {
  const history = new History<{ [k in TrackedKeys]: State[k] }>();

  return function(
    state: State | HistoryEnhancerState<State, TrackedKeys>,
    action: Action
  ): HistoryEnhancerState<State, TrackedKeys> {
    switch (action.type) {
      case UNDO:
      case REDO: {
        const condition =
          action.type === UNDO ? history.canUndo() : history.canRedo();
        const fn = action.type === UNDO ? history.undo : history.redo;

        if (condition) {
          fn.call(history);

          return addHistoryDataToState(
            {
              ...state,
              ...history.getCurrentSnapshot()
            },
            history
          );
        } else {
          if (isHistoryEnhancedState<State, TrackedKeys>(state)) {
            return state;
          } else {
            return addHistoryDataToState(
              {
                ...state,
                ...history.getCurrentSnapshot()
              },
              history
            );
          }
        }
      }
      default: {
        // state && delete state.historyTravelling;
        const newState = reducer(state, action);

        if (!action.type.includes("@@redux/INIT")) {
          if (config.onBeforeUpdate) {
            config.onBeforeUpdate(state, action, history);
          }

          const snapshot = createHistorySnapshot(newState, config.keysToTrack);
          history.update(snapshot, {
            replacePresent: Boolean(action?.meta?.historyReplacePresent)
          });
        }

        return addHistoryDataToState(newState, history);
      }
    }
  };
}
