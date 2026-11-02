import type { RedoAction, UndoAction } from "./types";

export function undo(): UndoAction {
  return {
    type: "UNDO"
  };
}

export function redo(): RedoAction {
  return {
    type: "REDO"
  };
}
