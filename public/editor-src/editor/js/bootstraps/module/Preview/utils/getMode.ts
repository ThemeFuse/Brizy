import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { Props } from "../types";

export function getMode(mode: Props["mode"]): EditorMode {
  switch (mode) {
    case "popup": {
      return Mode.external_popup;
    }
    case "story": {
      return Mode.external_story;
    }
    default: {
      return mode;
    }
  }
}
