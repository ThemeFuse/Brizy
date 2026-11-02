import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Account, ApiConnect, Done, Fields, List } from "../Step";

class Hubspot extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static list = List;
  static fields = Fields;
  static done = Done;
}

export default Hubspot;
