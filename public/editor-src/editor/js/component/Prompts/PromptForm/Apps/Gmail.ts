import { GmailFields, Done } from "../Step";
import { BaseApp } from "../../common/GlobalApps/BaseApp";

class Gmail extends BaseApp {
  static fields = GmailFields;
  static done = Done;
}

export default Gmail;
