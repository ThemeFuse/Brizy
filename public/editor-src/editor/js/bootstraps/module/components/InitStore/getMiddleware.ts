import { Middleware } from "redux";
import { thunk } from "redux-thunk";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { api, error, screenshots, sideEffects } from "visual/redux/middleware";

export function getMiddleware({
  editorMode,
  getConfig
}: {
  getConfig: GetConfig;
  editorMode: EditorMode;
}): Array<Middleware> {
  if (typeof window === "undefined") {
    return [thunk];
  }

  return [
    thunk,
    sideEffects({
      document,
      parentDocument: window.parent.document,
      getConfig
    }),
    error,
    screenshots(getConfig),
    api({ getConfig, editorMode })
  ];
}
