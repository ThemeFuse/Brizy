import { CustomFile } from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode } from "visual/providers/EditorModeProvider";

export interface Props {
  addFile: CustomFile["addFile"];
  editorMode: EditorMode;
}
