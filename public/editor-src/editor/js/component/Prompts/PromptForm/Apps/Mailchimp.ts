import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Account, ApiConnect, Done, Fields, List } from "../Step";

class Mailchimp extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static fields = Fields;
  static list = List;
  static done = Done;
}

export default Mailchimp;
