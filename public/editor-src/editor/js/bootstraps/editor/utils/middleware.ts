import { Middleware } from "redux";
import thunk from "redux-thunk";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { RenderType, isView } from "visual/providers/RenderProvider";
import { api, error, screenshots, sideEffects } from "visual/redux/middleware";

export default function getMiddleware(
  config: ConfigCommon,
  render: RenderType
): Array<Middleware> {
  if (typeof window === "undefined") {
    return [thunk];
  }

  if (isView(render)) {
    return [
      thunk,
      sideEffects({ document, parentDocument: window.parent.document })
    ];
  }

  return [
    thunk,
    sideEffects({ document, parentDocument: window.parent.document }),
    error,
    screenshots(config),
    api(config)
  ];
}
