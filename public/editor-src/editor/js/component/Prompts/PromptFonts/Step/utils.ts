import {
  AdobeConnectReader,
  AdobeDisconnectApp,
  AdobeDisconnectReader
} from "visual/component/Prompts/PromptFonts/Step/types";
import { AppData } from "visual/component/Prompts/common/GlobalApps/type";

export const adobeConnectReader = (app: AppData): AdobeConnectReader => ({
  title: app.title,
  img: app.img
});

export const adobeDisconnectReader = (
  app: AdobeDisconnectApp
): AdobeDisconnectReader => ({
  id: app.id
});
