import thunk from "redux-thunk";
import { browserSupports } from "visual/utils/screenshots";
import { error, sideEffects, screenshots, api } from "visual/redux/middleware";

export default async function getMiddleware() {
  let screenshotsSupported = await browserSupports();

  return [
    thunk,
    sideEffects({ document, parentDocument: window.parent.document }),
    error,
    ...(screenshotsSupported ? [screenshots] : []),
    api
  ];
}
