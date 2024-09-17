import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { AdobeDisconnect, Done } from "../Step";
import AdobeConnect from "../Step/AdobeConnect/index";

class Adobe extends BaseApp {
  static connect = AdobeConnect;
  static done = Done;
  static disconnect = AdobeDisconnect;
}

export default Adobe;
