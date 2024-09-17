import { AppData } from "visual/component/Prompts/common/GlobalApps/type";
import * as Obj from "visual/utils/reader/object";

export interface AdobeDisconnectReader {
  id: string;
}
export interface AdobeConnectReader {
  title: string;
  img: string;
}

export interface AdobeDisconnectApp extends AppData {
  type: string;
  completed: boolean;
}

export function isAdobeDisconnectData(
  value: AppData
): value is AdobeDisconnectApp {
  return !!Obj.read(value) && Obj.hasKeys(["type", "completed"], value);
}

export function isAdobeConnectData(value: AppData): value is AppData {
  return !!Obj.read(value);
}
