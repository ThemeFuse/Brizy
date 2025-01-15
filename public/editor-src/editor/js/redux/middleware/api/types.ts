import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ReduxState } from "visual/redux/types";
import { ReduxAction } from "../../actions2";

export interface Data {
  action: ReduxAction;
  state: ReduxState;
  oldState: ReduxState;
  config: ConfigCommon;
  apiHandler: (
    promise: Promise<unknown>,
    action: ReduxAction,
    onSuccess: VoidFunction,
    onError: VoidFunction
  ) => void;
}
