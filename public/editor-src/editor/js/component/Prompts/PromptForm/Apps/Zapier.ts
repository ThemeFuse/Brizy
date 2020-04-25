import { ApiConnect, Account, CustomFields, Done } from "../Step";
import { BaseApp } from "../../common/GlobalApps/BaseApp";

class Zapier extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static fields = CustomFields;
  static done = Done;
}

export default Zapier;
