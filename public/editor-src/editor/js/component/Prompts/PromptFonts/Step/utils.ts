import type { AppData } from "visual/component/Prompts/common/GlobalApps/type";
import type {
  AdobeConnectReader,
  AdobeDisconnectApp,
  AdobeDisconnectReader
} from "visual/component/Prompts/PromptFonts/Step/types";

export const adobeConnectReader = (app: AppData): AdobeConnectReader => ({
  title: app.title,
  img: app.img
});

export const adobeDisconnectReader = (
  app: AdobeDisconnectApp
): AdobeDisconnectReader => ({
  id: app.id
});
