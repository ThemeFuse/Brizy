import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Account, ApiConnect, Done, Fields } from "../Step";

class Drip extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static fields = Fields;
  static done = Done;
}

export default Drip;
