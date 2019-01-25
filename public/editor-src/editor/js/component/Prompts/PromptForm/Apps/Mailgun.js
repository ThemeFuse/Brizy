import { ApiConnect, Account, Fields, List, Done } from "../Step";

class Mailgun {
  static connect = ApiConnect;
  static account = Account;
  static fields = Fields;
  static list = List;
  static done = Done;
}

export default Mailgun;
