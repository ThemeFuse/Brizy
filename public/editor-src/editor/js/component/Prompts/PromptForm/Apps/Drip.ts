import { ApiConnect, Account, Fields, Done } from "../Step";
import { BaseApp } from "../../common/GlobalApps/BaseApp";

class Drip extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static fields = Fields;
  static done = Done;
}

export default Drip;
