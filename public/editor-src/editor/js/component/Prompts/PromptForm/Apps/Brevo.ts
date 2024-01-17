import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Account, ApiConnect, Client, Done, Fields, List } from "../Step";

class Brevo extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static client = Client;
  static fields = Fields;
  static list = List;
  static done = Done;
}

export default Brevo;
