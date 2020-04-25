import { RecaptchaConnect, RecaptchaDisconnect, Done } from "../Step";
import { BaseApp } from "../../common/GlobalApps/BaseApp";

class Recaptcha extends BaseApp {
  static connect = RecaptchaConnect;
  static done = Done;
  static disconnect = RecaptchaDisconnect;
}

export default Recaptcha;
