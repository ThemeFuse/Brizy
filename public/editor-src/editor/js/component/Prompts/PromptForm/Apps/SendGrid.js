import { ApiConnect, Account, Fields, List, Done } from "../Step";

class SendGrid {
  static connect = ApiConnect;
  static account = Account;
  static fields = Fields;
  static list = List;
  static done = Done;
}

export default SendGrid;
