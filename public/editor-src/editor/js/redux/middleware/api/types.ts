import { GetConfig } from "visual/providers/ConfigProvider/types";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { ReduxState } from "visual/redux/types";
import { ReduxAction } from "../../actions2";

export interface Data {
  action: ReduxAction;
  state: ReduxState;
  oldState: ReduxState;
  getConfig: GetConfig;
  apiHandler: (
    promise: Promise<unknown>,
    action: ReduxAction,
    onSuccess: VoidFunction,
    onError: VoidFunction
  ) => void;
  editorMode: EditorMode;
}
