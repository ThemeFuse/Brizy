import { Middleware } from "redux";
import thunk from "redux-thunk";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { api, error, screenshots, sideEffects } from "visual/redux/middleware";

export function getMiddleware({
  config,
  editorMode
}: {
  config: ConfigCommon;
  editorMode: EditorMode;
}): Array<Middleware> {
  if (typeof window === "undefined") {
    return [thunk];
  }

  return [
    thunk,
    sideEffects({ document, parentDocument: window.parent.document }),
    error,
    screenshots(config),
    api({ config, editorMode })
  ];
}
