import { ApiConnect, Account, Fields, List, Done } from "../Step";

class Mailerlite {
  static connect = ApiConnect;
  static account = Account;
  static fields = Fields;
  static list = List;
  static done = Done;
}

export default Mailerlite;
