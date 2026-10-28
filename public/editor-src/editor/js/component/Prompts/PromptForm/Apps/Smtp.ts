import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Done, SmtpFields } from "../Step";

class Smtp extends BaseApp {
  static fields = SmtpFields;
  static done = Done;
}

export default Smtp;
