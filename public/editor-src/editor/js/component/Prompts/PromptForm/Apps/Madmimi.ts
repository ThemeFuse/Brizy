import { ApiConnect, Account, List, Fields, Done } from "../Step";
import { BaseApp } from "../../common/GlobalApps/BaseApp";

class Madmimi extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static list = List;
  static fields = Fields;
  static done = Done;
}

export default Madmimi;
