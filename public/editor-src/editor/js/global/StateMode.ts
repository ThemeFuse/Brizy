import { type EditorMode, isStory } from "visual/providers/EditorModeProvider";
import { states as _states, type State } from "visual/utils/stateMode";

export const getStates = (editorMode: EditorMode): State[] =>
  isStory(editorMode) ? _states().filter((s) => s !== "hover") : _states();
