import thunk from "redux-thunk";
import Config from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { api, error, screenshots, sideEffects } from "visual/redux/middleware";
import { browserSupports } from "visual/utils/screenshots";

const hasApiScreenshot = (config: ConfigCommon): boolean => {
  const screenshots = config.api?.screenshots;

  return (
    typeof screenshots?.create === "function" &&
    typeof screenshots?.update === "function"
  );
};

const isScreenshotSupported = async (): Promise<boolean> => {
  try {
    const browserSupport = await browserSupports();
    const config = Config.getAll();
    return browserSupport && hasApiScreenshot(config);
  } catch (e) {
    return false;
  }
};

export default async function getMiddleware() {
  const screenshotsSupported = await isScreenshotSupported();

  return [
    thunk,
    sideEffects({ document, parentDocument: window.parent.document }),
    error,
    ...(screenshotsSupported ? [screenshots] : []),
    api
  ];
}
