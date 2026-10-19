import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Done, GmailFields } from "../Step";

class Gmail extends BaseApp {
  static fields = GmailFields;
  static done = Done;
}

export default Gmail;
