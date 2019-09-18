import thunk from "redux-thunk";
import {
  sideEffects,
  screenshots,
  browserSupportsScreenshots,
  api
} from "visual/redux/middleware";

export default async function getMiddleware() {
  let screenshotsSupported = await browserSupportsScreenshots();

  return [
    thunk,
    sideEffects({ document, parentDocument: window.parent.document }),
    ...(screenshotsSupported ? [screenshots] : []),
    api
  ];
}
