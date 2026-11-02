import type { GetConfig } from "visual/providers/ConfigProvider/types";
import type { EditorMode } from "visual/providers/EditorModeProvider";
import type { Store } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { ReduxAction } from "../../actions2";

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
    onError: (e: unknown) => void
  ) => void;
  editorMode: EditorMode;
}
