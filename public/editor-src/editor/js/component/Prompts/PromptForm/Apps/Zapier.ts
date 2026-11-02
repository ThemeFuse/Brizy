import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Account, ApiConnect, CustomFields, Done } from "../Step";

class Zapier extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static fields = CustomFields;
  static done = Done;
}

export default Zapier;
