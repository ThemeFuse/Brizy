import { RecaptchaConnect, RecaptchaDisconnect, Done } from "../Step";

class Recaptcha {
  static connect = RecaptchaConnect;
  static done = Done;
  static disconnect = RecaptchaDisconnect;
}

export default Recaptcha;
