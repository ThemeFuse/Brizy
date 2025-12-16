import {
  ConfigCommon,
  PublishData
} from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode } from "visual/providers/EditorModeProvider/context";
import { fetchPageSuccess } from "visual/redux/actions2";
import { Store } from "visual/redux/store";

export const waitForPendingAndDispatch = (
  type: "external" | "externalForce",
  store: Store,
  resCallback: (r: PublishData) => void,
  editorMode: EditorMode,
  config: ConfigCommon
): (() => void) | undefined => {
  const onDone = (r: PublishData) => {
    store.dispatch(fetchPageSuccess());
    resCallback(r);
  };

  const dispatchPublish = () => {
    store.dispatch({
      type: "PUBLISH",
      payload: {
        status: store.getState().page.status,
        type,
        editorMode,
        config,
        res: onDone
      }
    });
  };

  const checkPending = () => store.getState().blocksHtml.inPending;

  if (checkPending()) {
    const unsubscribe = store.subscribe(() => {
      if (!checkPending()) {
        unsubscribe();
        dispatchPublish();
      }
    });

    // Re-check after subscribing to handle race condition
    if (!checkPending()) {
      unsubscribe();
      dispatchPublish();
      return undefined; // No subscription to clean up
    }

    return unsubscribe; // Return unsubscribe function for cleanup
  } else {
    dispatchPublish();
    return undefined; // No subscription to clean up
  }
};
