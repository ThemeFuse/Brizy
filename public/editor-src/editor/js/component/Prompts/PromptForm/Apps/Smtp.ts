import { SmtpFields, Done } from "../Step";
import { BaseApp } from "../../common/GlobalApps/BaseApp";

class Smtp extends BaseApp {
  static fields = SmtpFields;
  static done = Done;
}

export default Smtp;
