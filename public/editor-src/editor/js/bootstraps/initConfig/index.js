import Config from "visual/global/Config";
import { readConfig } from "./readConfig";

const visualConfig = global.__VISUAL_CONFIG__;

try {
  Config.init(readConfig(visualConfig));
} catch (e) {
  // add some kind on notification for users
  // eslint-disable-next-line no-console
  console.error("config is brok en. Please contact support");
}
