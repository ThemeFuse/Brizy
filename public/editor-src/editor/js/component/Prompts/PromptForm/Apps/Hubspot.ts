import { ApiConnect, Account, List, Fields, Done } from "../Step";
import { BaseApp } from "../../common/GlobalApps/BaseApp";

class Hubspot extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static list = List;
  static fields = Fields;
  static done = Done;
}

export default Hubspot;
