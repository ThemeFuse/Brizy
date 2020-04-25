import { EmailFields, Done } from "../Step";
import { BaseApp } from "../../common/GlobalApps/BaseApp";

class Email extends BaseApp {
  static fields = EmailFields;
  static done = Done;
}

export default Email;
