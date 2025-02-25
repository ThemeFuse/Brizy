import { EditorMode, isStory } from "visual/providers/EditorModeProvider";
import { State, states as _states } from "visual/utils/stateMode";

export const getStates = (editorMode: EditorMode): State[] =>
  isStory(editorMode) ? _states().filter((s) => s !== "hover") : _states();
