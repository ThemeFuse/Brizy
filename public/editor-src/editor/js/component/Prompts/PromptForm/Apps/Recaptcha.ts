import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Done, RecaptchaConnect, RecaptchaDisconnect } from "../Step";

class Recaptcha extends BaseApp {
  static connect = RecaptchaConnect;
  static done = Done;
  static disconnect = RecaptchaDisconnect;
}

export default Recaptcha;
