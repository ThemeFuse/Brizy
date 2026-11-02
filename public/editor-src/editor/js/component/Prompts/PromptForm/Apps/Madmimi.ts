import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Account, ApiConnect, Done, Fields, List } from "../Step";

class Madmimi extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static list = List;
  static fields = Fields;
  static done = Done;
}

export default Madmimi;
