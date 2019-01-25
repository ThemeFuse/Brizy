import { ApiConnect, Account, List, Fields, Done } from "../Step";

class Hubspot {
  static connect = ApiConnect;
  static account = Account;
  static list = List;
  static fields = Fields;
  static done = Done;
}

export default Hubspot;
