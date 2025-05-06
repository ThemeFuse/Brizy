import { GetConfig } from "visual/providers/ConfigProvider/types";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { Store } from "visual/redux/store";
import { ReduxState } from "visual/redux/types";
import { ReduxAction } from "../../actions2";

export interface Data {
  action: ReduxAction;
  state: ReduxState;
  store: Store;
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
