import { Action, ActionKind, State } from "./types";

export function reducer(_state: State, action: Action) {
  const { type, error } = action;
  switch (type) {
    case ActionKind.idle: {
      return { status: ActionKind.idle };
    }
    case ActionKind.init: {
      return { status: ActionKind.init };
    }
    case ActionKind.load: {
      return { status: ActionKind.load };
    }
    case ActionKind.ready: {
      return { status: ActionKind.ready };
    }
    case ActionKind.error: {
      return { status: ActionKind.error, error };
    }
  }
}
